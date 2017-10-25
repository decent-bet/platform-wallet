import React, {Component} from 'react'
import {browserHistory} from 'react-router'

import {LinearProgress} from 'material-ui'

import EtherScan from '../Base/EtherScan'
import EventBus from 'eventing-bus'
import Helper from '../Helper'
import PendingTxHandler from '../Base/PendingTxHandler'

import './wallet.css'

const constants = require('../Constants')
const etherScan = new EtherScan()
const helper = new Helper()
const pendingTxHandler = new PendingTxHandler()

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
                confirmed: {},
                pending: {}
            }
        }
    }

    componentWillMount = () => {
        this.initData()
        this.initWatchers()
    }

    initData = () => {
        if (window.web3Loaded)
            this.initWeb3Data()
        else
            EventBus.on('web3Loaded', () => {
                this.initWeb3Data()
            })
    }

    initWeb3Data = () => {
        this.web3Getters().dbetBalance()
        this.web3Getters().pendingTransactions()
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
                        self.helpers().addConfirmedTransactions(res, transactions)

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
                        self.helpers().addConfirmedTransactions(res, transactions)

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
            pendingTransactions: () => {
                let pending = pendingTxHandler.getTxs()
                pending.forEach((tx) => {
                    self.web3Getters().transaction(tx)
                })
            },
            transaction: (tx) => {
                helper.getWeb3().eth.getTransaction(tx.hash, (err, _tx) => {
                    if (!err) {
                        let transactions = self.state.transactions
                        console.log('Retrieved pending transaction', _tx)
                        if (_tx.blockNumber == null)
                            self.helpers().addPendingTransactions(_tx, tx.to, tx.value, transactions)
                        console.log('Pending transactions', transactions.pending)
                        self.setState({
                            transactions: transactions
                        })
                    }
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
            addConfirmedTransactions: (res, transactions) => {
                res.result.map((tx) => {
                    let value = helper.formatDbets(helper.getWeb3().toDecimal(tx.data))
                    let timestamp = helper.getWeb3().toDecimal(tx.timeStamp)

                    transactions.confirmed[tx.transactionHash] = {
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
            addPendingTransactions: (tx, to, value, transactions) => {
                transactions.pending[tx.hash] = {
                    block: {
                        hash: tx.hash
                    },
                    from: tx.from,
                    to: to,
                    value: value
                }
            },
            pendingTransactionsAvailable: () => {
                return Object.keys(self.state.transactions.pending).length > 0
            },
            transactionsLoaded: () => {
                return (!self.state.transactions.loading.from && !self.state.transactions.loading.to)
            },
            transactionsAvailable: () => {
                return Object.keys(self.state.transactions.confirmed).length > 0
            },
            formatAddress: (address) => {
                return address === '0x0000000000000000000000000000000000000000' ?
                    'DBET Token Contract' : address
            },
            getSortedTransactions: () => {
                let txs = []
                let txHashes = Object.keys(self.state.transactions.confirmed)
                txHashes.forEach((txHash) => {
                    txs.push(self.state.transactions.confirmed[txHash])
                })
                txs = txs.sort((a, b) => {
                    return b.block.timestamp - a.block.timestamp
                })
                return txs
            },
            getPendingTransactions: () => {
                let txs = []
                let txHashes = Object.keys(self.state.transactions.pending)
                txHashes.forEach((txHash) => {
                    txs.push(self.state.transactions.pending[txHash])
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
            confirmedTransactions: () => {
                return <div className="col-10 offset-1 offset-md-0 col-md-12 transactions px-0">
                    {   self.helpers().getSortedTransactions().map((tx) =>
                        self.views().confirmedTransaction(tx)
                    )}
                </div>
            },
            confirmedTransaction: (tx) => {
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
            pendingTransactions: () => {
                return <div className="col-10 offset-1 offset-md-0 col-md-12 transactions px-0 my-4">
                    <h3>PENDING</h3>
                    {   self.helpers().getPendingTransactions().map((tx) =>
                        self.views().pendingTransaction(tx)
                    )}
                </div>
            },
            pendingTransaction: (tx) => {
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
                            <section>
                                <p className="type">Send DBETs</p>
                                <p className="address">{self.helpers().formatAddress(tx.to)}</p>
                            </section>
                            <p className="timestamp">Pending</p>
                        </div>
                        <div className="col-4 col-md-3 pt-2 pl-0">
                            <p className="value">{helper.formatNumber(tx.value)}</p>
                        </div>
                    </div>
                </div>
            },
            noTransactions: () => {
                return <div className="col-12 mt-4 no-transactions">
                    <h3>No Transaction History yet..</h3>
                    <p>Future token transfers will be listed here</p>
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
                        {   self.helpers().pendingTransactionsAvailable() &&
                        (self.views().pendingTransactions())
                        }
                        {   self.helpers().transactionsLoaded() && self.helpers().transactionsAvailable() &&
                        (self.views().confirmedTransactions())
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