/**
 * Created by user on 9/11/2017.
 */

import React, {Component} from 'react'

import EtherScan from '../../Base/EtherScan'
import EventBus from 'eventing-bus'
import Helper from '../../Helper'

import './wallet.css'

const etherScan = new EtherScan()
const helper = new Helper()

const constants = require('../../Constants')
const ethUnits = require('ethereum-units')

class Wallet extends Component {

    constructor(props) {
        super(props)
        let ethNetwork = helper.getWeb3().version.network
        ethNetwork = ethNetwork <= parseInt(constants.ETHEREUM_NETWORK_KOVAN) ?
            ethNetwork : constants.ETHEREUM_NETWORK_LOCAL
        console.log('Ethereum Network', ethNetwork)
        console.log('Address', helper.getWeb3().eth.defaultAccount)
        let address = helper.getWeb3().eth.defaultAccount.toLowerCase()
        this.state = {
            ethNetwork: ethNetwork,
            balance: 0,
            address: address,
            transactions: {}
        }
    }

    componentWillMount = () => {
        this.initData()
        this.initWatchers()
    }

    initData = () => {
        EventBus.on('web3Loaded', () => {
            this.web3Getters().dbetBalance()
        })
    }

    initWatchers = () => {
        this.apiGetters().transfersFrom()
        this.apiGetters().transfersTo()
    }

    apiGetters = () => {
        const self = this
        return {
            transfersFrom: () => {
                etherScan.getTransferLogs(true, (err, res) => {
                    console.log('transfersFrom', err, res)
                })
            },
            transfersTo: () => {
                etherScan.getTransferLogs(false, (err, res) => {
                    console.log('transfersTo', err, res)
                    if (!err) {
                        let transactions = self.state.transactions

                        res.result.map((tx) => {
                            let value = helper.formatDbets(helper.getWeb3().toDecimal(tx.data))
                            let timestamp = helper.getWeb3().toDecimal(tx.timeStamp)

                            transactions[tx.transactionHash] = {
                                block: {
                                    timestamp: timestamp,
                                    number: tx.blockNumber,
                                    hash: tx.transactionHash
                                },
                                from: etherScan._unformatAddress(tx.topics[1]),
                                to: etherScan._unformatAddress(tx.topics[2]),
                                value: value
                            }


                            console.log('Tx', transactions[tx.transactionHash])
                        })

                        self.setState({
                            transactions: transactions
                        })
                    }
                })
            }
        }
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
                return <div className="col-12 send" onClick={() => {
                    self.props.onSend()
                }}>
                    <div className="row h-100">
                        <div className="col my-auto">
                            <p><i className="fa fa-paper-plane-o mr-2"/> Send DBETs</p>
                        </div>
                    </div>
                </div>
            },
            transactions: () => {
                return <div className="col-12 transactions px-0">
                    {   Object.keys(self.state.transactions).map((txHash) =>
                        self.views().transaction(self.state.transactions[txHash])
                    )}
                </div>
            },
            transaction: (tx) => {
                return <div className="tx">
                    <div className="row h-100">
                        <div className="col-2 my-auto">
                            {tx.from == self.state.address &&
                            <i className="fa fa-paper-plane-o"/>
                            }
                            {tx.to == self.state.address &&
                            <i className="fa fa-arrow-circle-o-down"/>
                            }
                        </div>
                        <div className="col-7 pt-3">
                            {tx.from == self.state.address &&
                            <p className="type">Sent DBETs</p>
                            }
                            {tx.to == self.state.address &&
                            <p className="type">Received DBETs</p>
                            }
                            <p className="timestamp">{new Date(tx.block.timestamp * 1000).toUTCString()}</p>
                        </div>
                        <div className="col-3 pt-2">
                            <p className="value">{tx.value}</p>
                        </div>
                    </div>
                </div>
            }
        }
    }

    render() {
        const self = this
        return (
            <div className="wallet">
                <div className="container">
                    <div className="row">
                        {self.views().total()}
                        {self.views().balance()}
                        {self.views().send()}
                        {self.views().transactions()}
                    </div>
                </div>
            </div>
        )
    }

}

export default Wallet