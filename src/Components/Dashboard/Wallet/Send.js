import React, {Component} from 'react'
import {browserHistory} from 'react-router'

import {FlatButton} from 'material-ui'

import Backspace from 'material-ui/svg-icons/content/backspace'
import ConfirmationDialog from '../../Base/Dialogs/ConfirmationDialog'
import EventBus from 'eventing-bus'
import Helper from '../../Helper'

import './send.css'

const helper = new Helper()
const constants = require('../../Constants')
const styles = require('../../Base/styles').styles

class Send extends Component {

    constructor(props) {
        super(props)
        let ethNetwork = helper.getWeb3().version.network
        ethNetwork = ethNetwork <= parseInt(constants.ETHEREUM_NETWORK_KOVAN) ?
            ethNetwork : constants.ETHEREUM_NETWORK_LOCAL
        let address = helper.getWeb3().eth.defaultAccount
        this.state = {
            ethNetwork: ethNetwork,
            balance: 0,
            address: address,
            enteredValue: '0',
            dialogs: {
                error: {
                    open: false,
                    title: '',
                    message: ''
                }
            }
        }
    }

    componentWillMount = () => {
        this.initData()
    }

    initData = () => {
        EventBus.on('web3Loaded', () => {
            this.web3Getters().dbetBalance()
        })
    }

    web3Getters = () => {
        const self = this
        return {
            dbetBalance: () => {
                helper.getContractHelper().getWrappers().token()
                    .balanceOf(helper.getWeb3().eth.defaultAccount).then((balance) => {
                    balance = helper.formatDbets(balance)
                    self.setState({
                        balance: balance
                    })
                }).catch((err) => {
                    console.log('dbetBalance err', err.message)
                })
            }
        }
    }

    views = () => {
        const self = this
        return {
            back: () => {
                return <div className="col-10 offset-1 col-md-12 offset-md-0 back px-0">
                    <FlatButton
                        label="Back"
                        onClick={() => {
                            browserHistory.push(constants.PAGE_WALLET)
                        }}
                    />
                </div>
            },
            balance: () => {
                return <div className="col-10 offset-1 col-md-12 offset-md-0 balance">
                    <div className="row h-100 px-4">
                        <div className="col my-auto">
                            <p>
                                <img src={process.env.PUBLIC_URL + '/assets/img/icons/dbet.png'}/>
                                {self.state.balance} DBETs available
                            </p>
                        </div>
                    </div>
                </div>
            },
            entry: () => {
                return <div className="col-10 offset-1 col-md-12 offset-md-0 entry">
                    <div className="row h-100 px-4">
                        <div className="col my-auto">
                            <p>{self.state.enteredValue}</p>
                        </div>
                    </div>
                </div>
            },
            keyboard: () => {
                return <div className="col-10 offset-1 col-md-12 offset-md-0 keyboard mb-4">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 col-md-6 mx-auto">
                                <div className="row py-4">
                                    { self.views().keys()}
                                    <div className="col-12 mt-4">
                                        <FlatButton
                                            className="mx-auto d-block"
                                            label={<span><i className="fa fa-paper-plane-o mr-2"/> Send DBETs</span>}
                                            labelStyle={styles.keyboard.send}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            },
            keys: () => {
                const keyCount = 12
                let keys = []
                for (let i = 1; i <= keyCount; i++)
                    keys.push(self.views().key(i))
                return keys
            },
            key: (k) => {
                return <div className="col-4">
                    <FlatButton
                        label={self.helpers().getFormattedKey(k)}
                        fullWidth={true}
                        style={styles.keyboard.key}
                        labelStyle={styles.keyboard.label}
                        onClick={() => {
                            let enteredValue = self.state.enteredValue
                            if (k < constants.KEY_DOT && enteredValue.length <= 9) {
                                enteredValue = ((enteredValue == '0') ? k.toString() : enteredValue.concat(k))
                            } else if (k == constants.KEY_ZERO && enteredValue.length <= 9) {
                                enteredValue = ((enteredValue == '0') ? '0' : enteredValue.concat('0'))
                            } else if (k == constants.KEY_DOT && enteredValue.length <= 9) {
                                if (enteredValue.indexOf('.') != -1)
                                    return
                                enteredValue = enteredValue.concat('.')
                            } else if (k == constants.KEY_BACKSPACE) {
                                if (enteredValue.length == 1)
                                    enteredValue = '0'
                                else {
                                    enteredValue = enteredValue.slice(0, -1)
                                }
                            }
                            self.setState({
                                enteredValue: enteredValue
                            })
                        }}
                        className="mx-auto d-block"/>
                </div>
            }
        }
    }

    dialogs = () => {
        const self = this
        return {
            error: () => {
                return <ConfirmationDialog
                    onClick={() => {
                        self.helpers().toggleErrorDialog(false)
                    }}
                    onClose={() => {
                        self.helpers().toggleErrorDialog(false)
                    }}
                    title={self.state.dialogs.error.title}
                    message={self.state.dialogs.error.message}
                    open={self.state.dialogs.error.open}
                />
            }
        }
    }

    helpers = () => {
        return {
            getFormattedKey: (k) => {
                if (k < constants.KEY_DOT)
                    return k
                switch (k) {
                    case constants.KEY_DOT:
                        return '.'
                    case constants.KEY_ZERO:
                        return '0'
                    case constants.KEY_BACKSPACE:
                        return <Backspace/>
                }
            }
        }
    }

    render() {
        const self = this

        return (
            <div className="send">
                <div className="container">
                    <div className="row">
                        {self.views().back()}
                        {self.views().balance()}
                        {self.views().entry()}
                        {self.views().keyboard()}
                    </div>
                </div>
                {self.dialogs().error()}
            </div>
        )
    }
}

export default Send