import React, {Component} from 'react'
import TextField from 'material-ui/TextField'
import Keyboard from 'react-material-ui-keyboard'
import Helper from '../../Helper'
import Themes from '../../Base/Themes'

const themes = new Themes()

const helper = new Helper()
const constants = require('../../Constants')
import './wallet.css'
import {MuiThemeProvider} from "material-ui"

const keyboard = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    [',', '0', 'Backspace']
]

class Send extends Component {

    constructor(props) {
        super(props)
        let ethNetwork = helper.getWeb3().version.network
        ethNetwork = ethNetwork <= parseInt(constants.ETHEREUM_NETWORK_KOVAN) ?
            ethNetwork : constants.ETHEREUM_NETWORK_LOCAL
        console.log('Ethereum Network', ethNetwork)
        console.log('Address', helper.getWeb3().eth.defaultAccount.address)
        let address = helper.getWeb3().eth.defaultAccount.address
        this.state = {
            ethNetwork: ethNetwork,
            balance: 0,
            address: address,
            transactions: [{
                block: {
                    number: 4369584,
                    hash: "0x0d8c13407a29c44ecb8a9def74f124ef3ace26b28274e0e3751d09c520397e6c",
                    timestamp: 1508119188
                },
                from: address,
                to: "y",
                value: 1
            },
                {
                    block: {
                        number: 4369584,
                        hash: "0x0d8c13407a29c44ecb8a9def74f124ef3ace26b28274e0e3751d09c520397e6c",
                        timestamp: 1508119188
                    },
                    from: "y",
                    to: address,
                    value: 2
                }]
        }
    }

    componentWillMount = () => {
        // this.initData()
        // this.initWatchers()
    }

    initData = () => {
        this.web3Getters().dbetBalance()
    }

    web3Getters = () => {
        const self = this
        return {
            dbetBalance: () => {
                console.log('dbetBalance', helper.getWeb3().eth.defaultAccount.address)
                helper.getContractHelper().getWrappers().token()
                    .balanceOf(helper.getWeb3().eth.defaultAccount.address).then((balance) => {
                    console.log('dbetBalance', balance.toString())
                    self.setState({
                        balance: balance.toString()
                    })
                }).catch((err) => {
                    console.log('dbetBalance err', err.message)
                })
            },
            getBlock: (blockNumber, callback) => {
                helper.getWeb3().eth.getBlock(blockNumber, (err, block) => {
                    callback(err, block)
                })
            }
        }
    }

    helpers = () => {
        const self = this
        return {
            addTransaction: (blockNumber, from, to, value) => {
                self.web3Getters().getBlock(blockNumber, (err, block) => {
                    if (!err) {
                        const transactions = self.state.transactions
                        transactions.push({
                            block: {
                                hash: block.hash,
                                number: blockNumber,
                                timestamp: block.timestamp,
                            },
                            from: from,
                            to: to,
                            value: value
                        })
                        self.setState({
                            transactions: transactions
                        })
                    }
                })
            }
        }
    }

    views = () => {
        const self = this
        return {
            total: () => {
                return <div className="col-12 total">
                    <div className="row h-100 px-4">
                        <p className="my-auto">Total</p>
                    </div>
                </div>
            },
            balance: () => {
                return <div className="col-12 balance">
                    <div className="row h-100 px-4">
                        <div className="col my-auto">
                            <p>{self.state.balance}
                                <img className="icon" src={process.env.PUBLIC_URL + '/assets/img/icons/dbet.png'}/></p>
                        </div>
                    </div>
                </div>
            },
            send: () => {
                return <div className="col-12 send">
                    <div className="row h-100">
                        <div className="col my-auto">
                            <p><i className="fa fa-paper-plane-o mr-2"/> Send DBETs</p>
                        </div>
                    </div>
                </div>
            }
        }
    }

    render() {
        const self = this
        return (
            <MuiThemeProvider muiTheme={themes.getSendScreen()}>

                <div className="keyboard">
                    <Keyboard
                        textField={
                            <TextField
                                id="text"
                                value={this.state.value}
                            />
                        }
                        open
                        onInput={this.onInput}
                        layouts={[keyboard]}
                    />;
                </div>
            </MuiThemeProvider>

        )
    }
}

export default Send