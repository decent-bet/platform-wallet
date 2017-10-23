import React, {Component} from 'react'
import {browserHistory} from 'react-router'

import {LinearProgress} from 'material-ui'

import EtherScan from '../Base/EtherScan'
import EventBus from 'eventing-bus'
import Helper from '../Helper'

import './wallet.css'

const constants = require('../Constants')
const etherScan = new EtherScan()
const helper = new Helper()

class Wallet extends Component {

    constructor(props) {
        super(props)
        let ethNetwork = helper.getWeb3().version.network
        ethNetwork = ethNetwork <= parseInt(constants.ETHEREUM_NETWORK_KOVAN) ?
            ethNetwork : constants.ETHEREUM_NETWORK_LOCAL
        let address = helper.getWeb3().eth.defaultAccount.toLowerCase()
        this.state = {
            ethNetwork: ethNetwork,
            balance: 0,
            address: address,
            transactions: {
                loading: {
                    from: true,
                    to: true
                },
                list: {}
            }
        }
    }

    componentWillMount = () => {
        this.initData()
        this.initWatchers()
    }

    initData = () => {
        if (window.web3Loaded)
            this.web3Getters().dbetBalance()
        else
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
                    let transactions = self.state.transactions
                    transactions.loading.from = false

                    if (!err)
                        self.helpers().addTransaction(res, transactions)

                    console.log('Transactions', transactions, res)
                    self.setState({
                        transactions: transactions
                    })
                })
            },
            transfersTo: () => {
                etherScan.getTransferLogs(false, (err, res) => {
                    let transactions = self.state.transactions
                    transactions.loading.to = false

                    if (!err)
                        self.helpers().addTransaction(res, transactions)

                    console.log('Transactions', transactions, res)

                    self.setState({
                        transactions: transactions
                    })
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
            addTransaction: (res, transactions) => {
                res.result.map((tx) => {
                    let value = helper.formatDbets(helper.getWeb3().toDecimal(tx.data))
                    let timestamp = helper.getWeb3().toDecimal(tx.timeStamp)

                    transactions.list[tx.transactionHash] = {
                        block: {
                            timestamp: timestamp,
                            number: tx.blockNumber,
                            hash: tx.transactionHash
                        },
                        from: etherScan._unformatAddress(tx.topics[1]),
                        to: etherScan._unformatAddress(tx.topics[2]),
                        value: value
                    }
                })
            },
            transactionsLoaded: () => {
                return (!self.state.transactions.loading.from && !self.state.transactions.loading.to)
            },
            transactionsAvailable: () => {
                return Object.keys(self.state.transactions.list).length > 0
            },
            formatAddress: (address) => {
                return address === '0x0000000000000000000000000000000000000000' ?
                    'DBET Token Contract' : address
            },
            getSortedTransactions: () => {
                let txs = []
                let txHashes = Object.keys(self.state.transactions.list)
                txHashes.forEach((txHash) => {
                    txs.push(self.state.transactions.list[txHash])
                })
                txs = txs.sort((a, b) => {
                    return b.block.timestamp - a.block.timestamp
                })
                return txs
            }
        }
    }

    views = () => {
        const self = this
        return {
            total: () => {
                return <div className="col-10 offset-1 offset-md-0 col-md-12 total">
                    <div className="row h-100 px-4">
                        <p className="my-auto">Total</p>
                    </div>
                </div>
            },
            balance: () => {
                return <div className="col-10 offset-1 offset-md-0 col-md-12 balance">
                    <div className="row h-100 px-2 px-md-4">
                        <div className="col my-auto">
                            <p>{self.state.balance}
                                <img className="icon" src={process.env.PUBLIC_URL + '/assets/img/icons/dbet.png'}/></p>
                        </div>
                    </div>
                </div>
            },
            send: () => {
                return <div className="col-10 offset-1 offset-md-0 col-md-12 send" onClick={() => {
                    browserHistory.push(constants.PAGE_WALLET_SEND)
                }}>
                    <div className="row h-100">
                        <div className="col my-auto">
                            <p><i className="fa fa-paper-plane-o mr-2"/> Send DBETs</p>
                        </div>
                    </div>
                </div>
            },
            transactions: () => {
                return <div className="col-10 offset-1 offset-md-0 col-md-12 transactions px-0">
                    {   self.helpers().getSortedTransactions().map((tx) =>
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
                        <div className="col-6 col-md-7 pt-3">
                            {tx.from == self.state.address &&
                            <section>
                                <p className="type">Sent DBETs</p>
                                <p className="address">{self.helpers().formatAddress(tx.to)}</p>
                            </section>
                            }
                            {tx.to == self.state.address &&
                            <section>
                                <p className="type">Received DBETs</p>
                                <p className="address">{self.helpers().formatAddress(tx.from)}</p>
                            </section>
                            }
                            <p className="timestamp">{new Date(tx.block.timestamp * 1000).toUTCString()}</p>
                        </div>
                        <div className="col-4 col-md-3 pt-2 pl-0">
                            <p className="value">{helper.formatNumber(tx.value)}</p>
                        </div>
                    </div>
                </div>
            },
            noTransactions: () => {
                return <div className="col-12 mt-4 no-transactions">
                    <h3>No Transactions Available..</h3>
                    <p>Future token transfers will be viewable here</p>
                </div>
            },
            loadingTransactions: () => {
                return <div className="col-12 pt-4 mt-4 loading-transactions">
                    <LinearProgress
                        color={constants.COLOR_GOLD}
                    />
                    <h3>Loading Transactions..</h3>
                </div>
            }
        }
    }

    render() {
        const self = this
        return (
            <div className="wallet">
                <div className="container">
                    <div className="row pb-4">
                        {self.views().total()}
                        {self.views().balance()}
                        {self.views().send()}
                        {   self.helpers().transactionsLoaded() && self.helpers().transactionsAvailable() &&
                        (self.views().transactions())
                        }
                        {   self.helpers().transactionsLoaded() && !self.helpers().transactionsAvailable() &&
                        (self.views().noTransactions())
                        }
                        {   !self.helpers().transactionsLoaded() &&
                        (self.views().loadingTransactions())
                        }
                    </div>
                </div>
            </div>
        )
    }

}

export default Wallet