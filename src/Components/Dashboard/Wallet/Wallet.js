/**
 * Created by user on 9/11/2017.
 */

import React, {Component} from 'react'

import Helper from '../../Helper'

const helper = new Helper()

const constants = require('../../Constants')

import './wallet.css'

class Wallet extends Component {

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
        this.initData()
        this.initWatchers()
    }

    initData = () => {
        this.web3Getters().dbetBalance()
    }

    initWatchers = () => {
        this.watchers().transferFrom()
        this.watchers().transferTo()
    }

    watchers = () => {
        const self = this
        return {
            transferFrom: () => {
                helper.getContractHelper().getWrappers().token()
                    .logTransfer(self.state.address, true).watch((err, event) => {
                    console.log('transferFrom', err, event)
                    if (!err) {
                        const blockNumber = event.blockNumber
                        const from = event.args.from
                        const to = event.args.to
                        const value = event.args.value

                        self.helpers().addTransaction(blockNumber, from, to, value.toString())
                    }
                })
            },

            transferTo: () => {
                helper.getContractHelper().getWrappers().token()
                    .logTransfer(self.state.address, false).watch((err, event) => {
                    console.log('transferTo', err, event)
                    if (!err) {
                        const blockNumber = event.blockNumber
                        const from = event.args.from
                        const to = event.args.to
                        const value = event.args.value

                        self.helpers().addTransaction(blockNumber, from, to, value.toString())
                    }
                })
            }
        }
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
            },
            transactions: () => {
                return <div className="col-12 transactions px-0">
                    {   self.state.transactions.map((tx) =>
                        self.views().transaction(tx)
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
                        <div className="col-8 pt-3">
                            {tx.from == self.state.address &&
                            <p className="type">Sent DBETs</p>
                            }
                            {tx.to == self.state.address &&
                            <p className="type">Received DBETs</p>
                            }
                            <p className="timestamp">{new Date(tx.block.timestamp * 1000).toUTCString()}</p>
                        </div>
                        <div className="col-2 pt-2">
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