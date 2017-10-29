import React, {Component} from 'react'
import {browserHistory} from 'react-router'

import {FlatButton, LinearProgress, MuiThemeProvider} from 'material-ui'

import ConfirmationDialog from '../Base/Dialogs/ConfirmationDialog'
import EtherScan from '../Base/EtherScan'
import EventBus from 'eventing-bus'
import Helper from '../Helper'
import PendingTxHandler from '../Base/PendingTxHandler'
import ReactMaterialUiNotifications from '../Base/Libraries/ReactMaterialUiNotifications'

import Themes from '../Base/Themes'

import './wallet.css'

const constants = require('../Constants')
const etherScan = new EtherScan()
const helper = new Helper()
const pendingTxHandler = new PendingTxHandler()
const themes = new Themes()

const DIALOG_LEARN_MORE = 0, DIALOG_TOKEN_UPGRADE = 1

class Wallet extends Component {

    constructor(props) {
        super(props)
        let address = helper.getWeb3().eth.defaultAccount.toLowerCase()
        this.state = {
            balances: {
                oldToken: 0,
                newToken: 0
            },
            selectedTokenContract: props.selectedTokenContract,
            address: address,
            transactions: {
                loading: {
                    from: true,
                    to: true
                },
                confirmed: {},
                pending: {}
            },
            dialogs: {
                upgrade: {
                    learnMore: {
                        open: false
                    },
                    tokenUpgrade: {
                        open: false
                    }
                }
            }
        }
    }

    componentWillMount = () => {
        this.initData()
        this.initWatchers()
    }

    componentWillReceiveProps = (props) => {
        if (props.selectedTokenContract !== this.state.selectedTokenContract) {
            this.setState({
                selectedTokenContract: props.selectedTokenContract
            })
            this.clearData()
            this.initData()
            this.initWatchers()
        }
    }

    clearData = () => {
        this.setState({
            transactions: {
                loading: {
                    from: true,
                    to: true
                },
                confirmed: {},
                pending: {}
            }
        })
    }

    initData = () => {
        if (window.web3Loaded)
            this.initWeb3Data()
        else {
            let web3Loaded = EventBus.on('web3Loaded', () => {
                this.initWeb3Data()
                // Unregister callback
                web3Loaded()
            })
        }
    }

    initWeb3Data = () => {
        this.web3Getters().dbetBalance.oldToken()
        this.web3Getters().dbetBalance.newToken()
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
            dbetBalance: {
                oldToken: () => {
                    helper.getContractHelper().getWrappers().oldToken()
                        .balanceOf(helper.getWeb3().eth.defaultAccount).then((balance) => {
                        balance = helper.formatDbets(balance)
                        if (balance > 0)
                            self.helpers().showTokenUpgradeNotification(balance)
                        let balances = self.state.balances
                        balances.oldToken = balance
                        self.setState({
                            balances: balances
                        })
                        console.log('Old token balance', balance)
                    }).catch((err) => {
                        console.log('dbetBalance oldToken err', err.message)
                    })
                },
                newToken: () => {
                    helper.getContractHelper().getWrappers().newToken()
                        .balanceOf(helper.getWeb3().eth.defaultAccount).then((balance) => {
                        balance = helper.formatDbets(balance)
                        let balances = self.state.balances
                        balances.newToken = balance
                        self.setState({
                            balances: balances
                        })
                        console.log('New token balance', balance)
                    }).catch((err) => {
                        console.log('dbetBalance newToken err', err.message)
                    })
                }
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
                        if (_tx.blockNumber == null && tx.tokenType == self.state.selectedTokenContract)
                            self.helpers().addPendingTransactions(_tx, tx.to, tx.value, transactions)
                        else
                            pendingTxHandler.removeTx(tx.hash)
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
            },
            showTokenUpgradeNotification: (oldTokenBalance) => {
                ReactMaterialUiNotifications.clearNotifications()
                ReactMaterialUiNotifications.showNotification({
                    title: 'Token Upgrade',
                    additionalText: 'Looks like you have ' + oldTokenBalance +
                    ' tokens remaining in the original Decent.bet token contract',
                    icon: <img src={process.env.PUBLIC_URL + '/assets/img/icons/dbet.png'}
                               className="dbet-icon"/>,
                    iconBadgeColor: constants.COLOR_TRANSPARENT,
                    overflowText: <div>
                        <FlatButton
                            label='Click to upgrade now'

                        />
                        <FlatButton
                            label='Learn more'
                            onClick={() => {
                                self.helpers().toggleDialog(DIALOG_LEARN_MORE, true)
                            }}
                        />
                    </div>,
                    style: {
                        height: '100% !important',
                        whiteSpace: 'inherit !important',
                        overflow: 'inherit !important'
                    }
                })
            },
            getTokenBalance: () => {
                switch (self.state.selectedTokenContract) {
                    case constants.TOKEN_TYPE_DBET_TOKEN_NEW:
                        return self.state.balances.newToken
                    case constants.TOKEN_TYPE_DBET_TOKEN_OLD:
                        return self.state.balances.oldToken
                }
            },
            toggleDialog: (type, open) => {
                let dialogs = self.state.dialogs
                if (type === DIALOG_LEARN_MORE)
                    dialogs.upgrade.learnMore.open = open
                else if (type === DIALOG_TOKEN_UPGRADE)
                    dialogs.upgrade.tokenUpgrade.open = open
                self.setState({
                    dialogs: dialogs
                })
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
            balances: () => {
                return <div className="col-10 offset-1 offset-md-0 col-md-12 balance">
                    <div className="row h-100 px-2 px-md-4">
                        <div className="col my-auto">
                            <p className="text-center">
                                {self.helpers().getTokenBalance()}
                                <img className="icon" src={process.env.PUBLIC_URL + '/assets/img/icons/dbet.png'}/>
                            </p>
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
                            {tx.from === self.state.address && tx.to !== self.state.address &&
                            <i className="fa fa-paper-plane-o"/>
                            }
                            {tx.to === self.state.address && tx.from !== self.state.address &&
                            <i className="fa fa-arrow-circle-o-down"/>
                            }
                            {tx.to === self.state.address && tx.from === self.state.address &&
                            <i className="fa fa-arrow-up"/>
                            }
                        </div>
                        <div className="col-6 col-md-7 pt-3">
                            {tx.from === self.state.address && tx.to !== self.state.address &&
                            <section>
                                <p className="type">Sent DBETs</p>
                                <p className="address">{self.helpers().formatAddress(tx.to)}</p>
                            </section>
                            }
                            {tx.to === self.state.address && tx.from !== self.state.address &&
                            <section>
                                <p className="type">Received DBETs</p>
                                <p className="address">{self.helpers().formatAddress(tx.from)}</p>
                            </section>
                            }
                            {tx.to === self.state.address && tx.from === self.state.address &&
                            <section>
                                <p className="type">Upgraded DBETs</p>
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
            },
            notifications: () => {
                return <MuiThemeProvider
                    muiTheme={themes.getNotification()}>
                    <ReactMaterialUiNotifications
                        desktop={true}
                        transitionName={{
                            leave: 'dummy',
                            leaveActive: 'fadeOut',
                            appear: 'dummy',
                            appearActive: 'zoomInUp'
                        }}
                        transitionAppear={true}
                        transitionLeave={true}
                    />
                </MuiThemeProvider>
            }
        }
    }

    dialogs = () => {
        const self = this
        return {
            upgrade: () => {
                return {
                    learnMore: () => {
                        return <ConfirmationDialog
                            title="DBET Token Upgrade Information"
                            message={
                                <section>
                                    <p>The Decent.bet token contract has been upgraded to it's current version
                                        - v2 -
                                        which
                                        issues the final total supply for the token contract along with a few
                                        improvements
                                        beneficial for
                                        future usage.
                                    </p>
                                    <ul>
                                        <li>Removal of crowdsale functions resulting in a leaner and easier to use token
                                            contract.
                                        </li>
                                        <li>Switch from throws to reverts for error conditions - which means that error
                                            transactions will not consume gas anymore saving transaction fees.
                                        </li>
                                        <li>
                                            Users can not transfer tokens to the token contract anymore - which
                                            otherwise would result in tokens being lost forever.
                                        </li>
                                    </ul>
                                    <p>All tokens from the initial contract will be upgraded at a 1:1 rate.
                                        If you had 100 DBETs on the initial contract, they will be upgraded to the
                                        current
                                        contract and removed from the initial contract. The new token contract will also
                                        be used for all platform functionality in the future, so please make sure
                                        tokens are upgraded as soon as possible.</p>
                                </section>}
                            open={self.state.dialogs.upgrade.learnMore.open}
                            onClick={() => {
                                self.helpers().toggleDialog(DIALOG_LEARN_MORE, false)
                            }}
                            onClose={() => {
                                self.helpers().toggleDialog(DIALOG_LEARN_MORE, false)
                            }}
                        />
                    }
                }
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
                        {self.views().balances()}
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
                        {self.views().notifications()}
                        {self.dialogs().upgrade().learnMore()}
                    </div>
                </div>
            </div>
        )
    }

}

export default Wallet