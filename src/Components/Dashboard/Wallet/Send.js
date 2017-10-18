import React, {Component} from 'react'
import Helper from '../../Helper'

const helper = new Helper()
const constants = require('../../Constants')
import './wallet.css'
import {
    FlatButton, Table, TableBody, TableRow,
    TableRowColumn
} from "material-ui"

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
            enteredValue: '',
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
            entry: () => {
                return <div className="col-12 balance">
                    <div className="row h-100 px-4">
                        <div className="col my-auto">
                            <p>{self.state.enteredValue}</p>
                        </div>
                    </div>
                </div>
            },
            keyboard: () => {
                const key = (k) => {
                    return <TableRowColumn>
                        <FlatButton className="keyboard"
                                    onclick={() => {
                                        this.setState({enteredValue: self.state.enteredValue + k.toString()})
                                    }}>{k}
                        </FlatButton></TableRowColumn>
                }
                return <Table selectable={false} className="keyboard">>
                    <TableBody>
                        <TableRow displayBorder={false} className="keyboard">
                            {key(1)}{key(2)}{key(3)}
                        </TableRow>
                        <TableRow displayBorder={false} className="keyboard">
                            {key(4)}{key(5)}{key(6)}
                        </TableRow>
                        <TableRow displayBorder={false} className="keyboard">
                            {key(7)}{key(8)}{key(9)}
                        </TableRow>
                        <TableRow displayBorder={false} className="keyboard">
                            {key(',')}{key('0')}{key(<i className="fa fa-window-close-o"></i>)}
                        </TableRow>
                    </TableBody>
                </Table>
            },
            sendButton: () => {
                return <div className="col send">
                    <FlatButton><i className="fa fa-paper-plane-o mr-2"/> Send DBETs</FlatButton>
                </div>
            }
        }
    }

    render() {
        const self = this

        return (
            <div className="keyboard">
                {self.views().entry()}
                {self.views().keyboard()}
                {self.views().sendButton()}
            </div>
        )
    }
}

export default Send