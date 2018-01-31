import React, {Component} from 'react'
import {browserHistory} from 'react-router'
import {FlatButton, MuiThemeProvider} from 'material-ui'

import EtherScan from '../Base/EtherScan'
import EventBus from 'eventing-bus'
import Helper from '../Helper'
import KeyHandler from '../Base/KeyHandler'
import PendingTxHandler from '../Base/PendingTxHandler'
import ReactMaterialUiNotifications from '../Base/Libraries/ReactMaterialUiNotifications'

import ConfirmationDialog from '../Base/Dialogs/ConfirmationDialog'
import PasswordEntryDialog from '../Base/Dialogs/PasswordEntryDialog'

import TokenUpgradeDialog from './Dialogs/TokenUpgradeDialog.jsx'
import ConfirmedTransactionList from './ConfirmedTransactionList.jsx'
import PendingTransactionsList from './PendingTransactionList.jsx'
import WalletHeader from './WalletHeader.jsx'

import Themes from '../Base/Themes'

import './wallet.css'

const constants = require('../Constants')
const etherScan = new EtherScan()
const helper = new Helper()
const keyHandler = new KeyHandler()
const pendingTxHandler = new PendingTxHandler()
const themes = new Themes()

const DIALOG_LEARN_MORE = 0, DIALOG_TOKEN_UPGRADE = 1, DIALOG_PASSWORD_ENTRY = 2, DIALOG_ERROR = 3

class Wallet extends Component {

    constructor(props) {
        super(props)
        let address = helper.getWeb3().eth.defaultAccount.toLowerCase()
        this.state = {
            balances: {
                oldToken: {
                    loading: true,
                    amount: 0
                },
                newToken: {
                    loading: true,
                    amount: 0
                },
                eth: {
                    loading: true,
                    amount: 0
                }
            },
            selectedTokenContract: props.selectedTokenContract,
            address: address,
            transactions: {
                loading: {
                    from: true,
                    to: true
                },
                pending: {},
                confirmed: {}
            },
            dialogs: {
                upgrade: {
                    learnMore: {
                        open: false
                    },
                    tokenUpgrade: {
                        open: false,
                        key: null
                    }
                },
                error: {
                    open: false
                },
                password: {
                    open: false
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
            this.refresh()
        }
    }

    refresh = () => {
        this.clearData()
        this.initData()
        this.initWatchers()
    }

    clearData = () => {
        let balances = this.state.balances
        balances.newToken.loading = true
        balances.oldToken.loading = true
        balances.eth.loading = true
        this.setState({
            transactions: {
                loading: {
                    from: true,
                    to: true
                },
                pending: {},
                confirmed: {}
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
        this.web3Getters().ethBalance()
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
            ethBalance: () => {
                helper.getWeb3().eth.getBalance(helper.getWeb3().eth.defaultAccount, (err, balance) => {
                    if (!err) {
                        let balances = self.state.balances
                        balances.eth = {
                            loading: false,
                            amount: helper.formatEther(balance.toString())
                        }
                        self.setState({
                            balances: balances
                        })
                    }
                })
            },
            dbetBalance: {
                oldToken: () => {
                    helper.getContractHelper().getWrappers().oldToken()
                        .balanceOf(helper.getWeb3().eth.defaultAccount).then((balance) => {
                        if (balance > 0)
                            self.helpers().showTokenUpgradeNotification(balance)
                        let balances = self.state.balances
                        balances.oldToken = {
                            loading: false,
                            amount: balance
                        }
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
                        let balances = self.state.balances
                        balances.newToken = {
                            loading: false,
                            amount: balance
                        }
                        console.log('New token balance', balance)
                        self.setState({
                            balances: balances
                        })
                    }).catch((err) => {
                        console.log('dbetBalance newToken err', err.message)
                    })
                }
            },
            pendingTransactions: () => {
                pendingTxHandler.getTxs().forEach((tx) => {
                    self.web3Getters().transaction(tx)
                })
            },
            transaction: (tx) => {
                helper.getWeb3().eth.getTransaction(tx.hash, (err, _tx) => {
                    console.log('Retrieved transaction', tx.hash, tx, err, _tx)
                    let transactions = self.state.transactions
                    if (!err) {
                        if (!_tx && tx.tokenType == self.state.selectedTokenContract) {
                            // Remove pending tx if it has been stuck at pending for a day or more
                            if (tx.timestamp <= (helper.getTimestamp() - 86400))
                                pendingTxHandler.removeTx(tx.hash)
                            else
                                self.helpers().addPendingTransaction(tx, transactions)
                        } else
                            self.helpers().switchPendingTransactionToConfirmed(tx, _tx)
                    } else {
                        if (tx.tokenType == self.state.selectedTokenContract)
                            self.helpers().addPendingTransaction(tx, transactions)
                    }
                    self.setState({
                        transactions: transactions
                    })
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
                    pendingTxHandler.removeTx(tx.transactionHash)

                    let value = helper.formatDbets(helper.getWeb3().toDecimal(tx.data))
                    let timestamp = helper.getWeb3().toDecimal(tx.timeStamp)

                    transactions.confirmed[tx.transactionHash] = {
                        block: {
                            timestamp: timestamp,
                            number: tx.blockNumber
                        },
                        hash: tx.transactionHash,
                        from: etherScan._unformatAddress(tx.topics[1]),
                        to: etherScan._unformatAddress(tx.topics[2]),
                        value: value
                    }
                })
            },
            switchPendingTransactionToConfirmed: (pendingTx, networkTx) => {
                let transactions = self.state.transactions
                transactions.confirmed[networkTx.hash] = {
                    block: {
                        timestamp: pendingTx.timestamp,
                        number: networkTx.blockNumber
                    },
                    hash: networkTx.hash,
                    from: networkTx.from,
                    to: networkTx.to,
                    value: pendingTx.value
                }
            },
            addPendingTransaction: (tx, transactions) => {
                transactions.pending[tx.hash] = tx
            },
            cachePendingTransaction: (txHash, to, amount) => {
                pendingTxHandler.cacheTx(self.state.selectedTokenContract, txHash, to, amount)
            },
            showTokenUpgradeNotification: (oldTokenBalance) => {
                ReactMaterialUiNotifications.clearNotifications()
                ReactMaterialUiNotifications.showNotification({
                    title: 'Token Upgrade',
                    additionalText: 'Looks like you have ' + helper.formatDbets(oldTokenBalance) +
                    ' tokens remaining in the original Decent.bet token contract',
                    icon: <img src={process.env.PUBLIC_URL + '/assets/img/icons/dbet.png'}
                               className="dbet-icon"/>,
                    iconBadgeColor: constants.COLOR_TRANSPARENT,
                    overflowText: <div>
                        <FlatButton
                            label='Click to upgrade now'
                            onClick={() => {
                                self.helpers().toggleDialog(DIALOG_PASSWORD_ENTRY, true)
                            }}
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
                        return (self.state.balances.newToken.loading) ?
                            constants.TOKEN_BALANCE_LOADING :
                            helper.formatDbets(self.state.balances.newToken.amount)
                    case constants.TOKEN_TYPE_DBET_TOKEN_OLD:
                        return (self.state.balances.oldToken.loading) ?
                            constants.TOKEN_BALANCE_LOADING :
                            helper.formatDbets(self.state.balances.oldToken.amount)
                }
            },
            toggleDialog: (type, open) => {
                let dialogs = self.state.dialogs
                if (type === DIALOG_LEARN_MORE)
                    dialogs.upgrade.learnMore.open = open
                else if (type === DIALOG_TOKEN_UPGRADE)
                    dialogs.upgrade.tokenUpgrade.open = open
                else if (type === DIALOG_PASSWORD_ENTRY)
                    dialogs.password.open = open
                else if (type === DIALOG_ERROR)
                    dialogs.error.open = open
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
                                    <p>The Decent.bet token contract has been upgraded to it&#8217;s current version
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
                    },
                    tokenUpgrade: () => {
                        return <TokenUpgradeDialog
                            open={self.state.dialogs.upgrade.tokenUpgrade.open}
                            balance={self.state.balances.oldToken.loading ?
                                constants.TOKEN_BALANCE_LOADING :
                                helper.formatDbets(self.state.balances.oldToken.amount)}
                            ethBalance={self.state.balances.eth.loading ?
                                        constants.TOKEN_BALANCE_LOADING :
                                        self.state.balances.eth.amount}
                            onUpgrade={() => {
                                let privateKey = self.state.dialogs.upgrade.tokenUpgrade.key
                                let address = keyHandler.getAddress()
                                let oldTokenBalance = self.state.balances.oldToken.amount
                                helper.getContractHelper().getWrappers()
                                    .oldToken()
                                    .upgrade(address, privateKey, oldTokenBalance, (err, res) => {
                                        if (!err) {
                                            self.helpers().cachePendingTransaction(res,
                                                helper.getWeb3().eth.defaultAccount,
                                                helper.formatDbets(oldTokenBalance))
                                            self.refresh()
                                        } else {
                                            self.helpers().toggleDialog(DIALOG_ERROR, true)
                                        }
                                        self.helpers().toggleDialog(DIALOG_TOKEN_UPGRADE, false)
                                    })
                            }}
                            onClose={() => {
                                self.helpers().toggleDialog(DIALOG_TOKEN_UPGRADE, false)
                            }}
                        />
                    }
                }
            },
            passwordEntry: () => {
                return <PasswordEntryDialog
                    open={self.state.dialogs.password.open}
                    onValidPassword={(password) => {
                        let dialogs = self.state.dialogs
                        dialogs.upgrade.tokenUpgrade.key = keyHandler.get(password)
                        self.setState({
                            dialogs: dialogs
                        })
                        self.helpers().toggleDialog(DIALOG_PASSWORD_ENTRY, false)
                        self.helpers().toggleDialog(DIALOG_TOKEN_UPGRADE, true)
                    }}
                    onClose={() => {
                        self.helpers().toggleDialog(DIALOG_PASSWORD_ENTRY, false)
                    }}
                />
            },
            error: () => {
                return <ConfirmationDialog
                    title="Error upgrading tokens"
                    message="Please make sure you have enough ETH to cover the transaction's gas costs"
                    open={self.state.dialogs.error.open}
                    onClick={() => {
                        self.helpers().toggleDialog(DIALOG_ERROR, false)
                    }}
                    onClose={() => {
                        self.helpers().toggleDialog(DIALOG_ERROR, false)
                    }}
                />
            }
        }
    }

    render() {
        const self = this
        let transactionsLoaded = (!self.state.transactions.loading.from && 
            !self.state.transactions.loading.to)
        return (
            <div className="wallet">
                <div className="container">
                    <div className="row pb-4">
                        <WalletHeader
                            onRefreshListener={this.refresh}
                            address={this.state.address}
                            />
                        {self.views().total()}
                        {self.views().balances()}
                        {self.views().send()}
                        <PendingTransactionsList
                            pendingTransactionsList={this.state.transactions.pending}
                            />
                        <ConfirmedTransactionList
                            transactionList={this.state.transactions.confirmed}
                            transactionsLoaded={transactionsLoaded}
                            walletAddress={this.state.address}
                            />
                        {self.views().notifications()}
                        {self.dialogs().upgrade().learnMore()}
                        {self.dialogs().upgrade().tokenUpgrade()}
                        {self.dialogs().passwordEntry()}
                        {self.dialogs().error()}
                    </div>
                </div>
            </div>
        )
    }

}

export default Wallet