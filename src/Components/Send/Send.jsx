import React, {Component} from 'react'
import {browserHistory} from 'react-router'
import {FlatButton, MuiThemeProvider, Snackbar } from 'material-ui'
import ConfirmationDialog from '../Base/Dialogs/ConfirmationDialog'
import EventBus from 'eventing-bus'
import Helper from '../Helper'
import PasswordEntryDialog from '../Base/Dialogs/PasswordEntryDialog'
import TransactionConfirmationDialog from './Dialogs/TransferConfirmationDialog.jsx'
import Keyboard from './Keyboard.jsx'
import ActionsPanel from './ActionsPanel.jsx'

import KeyHandler from '../Base/KeyHandler'
import PendingTxHandler from '../Base/PendingTxHandler'
import Themes from '../Base/Themes'

import './send.css'

const helper = new Helper()
const constants = require('../Constants')
const keyHandler = new KeyHandler()
const pendingTxHandler = new PendingTxHandler()
const themes = new Themes()

const DIALOG_ERROR = 0, DIALOG_PASSWORD_ENTRY = 1, DIALOG_TRANSACTION_CONFIRMATION = 2

class Send extends Component {

    constructor(props) {
        super(props)
        let address = helper.getWeb3().eth.defaultAccount
        console.log('Pending txs', pendingTxHandler.getTxs())
        this.state = {
            balances: {
                oldToken: {
                    loading: true,
                    amount: 0
                },
                newToken: {
                    loading: true,
                    amount: 0
                }
            },
            ethBalance: null,
            selectedTokenContract: props.selectedTokenContract,
            address: address,
            enteredValue: '0',
            dialogs: {
                error: {
                    open: false,
                    title: '',
                    message: ''
                },
                transactionConfirmation: {
                    open: false,
                    key: null
                },
                password: {
                    open: false
                }
            },
            snackbar: {
                message: '',
                open: false
            }
        }
    }

    componentDidMount = () => {
        this.initData()
    }

    componentWillReceiveProps = (props) => {
        if (props.selectedTokenContract !== this.state.selectedTokenContract) {
            this.setState({
                selectedTokenContract: props.selectedTokenContract
            })
            this.initData()
        }
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
    }

    web3Getters = () => {
        const self = this
        return {
            dbetBalance: {
                oldToken: () => {
                    helper.getContractHelper().getWrappers().oldToken()
                        .balanceOf(helper.getWeb3().eth.defaultAccount).then((balance) => {
                            balance = helper.formatDbetsMax(balance)
                            let balances = self.state.balances
                            balances.oldToken = {
                                amount: balance,
                                loading: false
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
                            balance = helper.formatDbetsMax(balance)
                            let balances = self.state.balances
                            balances.newToken = {
                                amount: balance,
                                loading: false
                            }
                            self.setState({
                                balances: balances
                            })
                            console.log('New token balance', balance)
                        }).catch((err) => {
                            console.log('dbetBalance newToken err', err.message)
                        })
                    }
            },
            ethBalance: () => {
                helper.getWeb3().eth.getBalance(helper.getWeb3().eth.defaultAccount, (err, balance) => {
                    if (!err) {
                        balance = parseFloat(helper.getWeb3().fromWei(balance.toString())).toFixed(6)
                        console.log('ETH balance', balance)
                        self.setState({
                            ethBalance: balance
                        })
                    }
                })
            }
        }
    }

    dialogs = () => {
        const self = this
        return {
            error: () => {
                return <ConfirmationDialog
                    onClick={() => {
                        self.helpers().toggleDialog(DIALOG_ERROR, false)
                    }}
                    onClose={() => {
                        self.helpers().toggleDialog(DIALOG_ERROR, false)
                    }}
                    title={self.state.dialogs.error.title}
                    message={self.state.dialogs.error.message}
                    open={self.state.dialogs.error.open}
                />
            },
            passwordEntry: () => {
                return <PasswordEntryDialog
                    open={self.state.dialogs.password.open}
                    onValidPassword={(password) => {
                        let dialogs = self.state.dialogs
                        dialogs.transactionConfirmation.key = keyHandler.get(password)
                        self.setState({
                            dialogs: dialogs
                        })
                        self.helpers().toggleDialog(DIALOG_PASSWORD_ENTRY, false)
                        self.helpers().toggleDialog(DIALOG_TRANSACTION_CONFIRMATION, true)
                    }}
                    onClose={() => {
                        self.helpers().toggleDialog(DIALOG_PASSWORD_ENTRY, false)
                    }}
                />
            },
            transactionConfirmation: () => {
                return <TransactionConfirmationDialog
                    open={self.state.dialogs.transactionConfirmation.open}
                    amount={self.state.enteredValue}
                    ethBalance={self.state.ethBalance}
                    onConfirmTransaction={(address, amount, gasPrice) => {
                        let privateKey = self.state.dialogs.transactionConfirmation.key
                        let weiAmount = helper.getWeb3().toWei(amount, 'ether')
                        let weiGasPrice = helper.getWeb3().toWei(gasPrice, 'gwei')
                        console.log('Sending tx', address, weiAmount, weiGasPrice, self.state.selectedTokenContract)
                        if (self.state.selectedTokenContract == constants.TOKEN_TYPE_DBET_TOKEN_NEW)
                            helper.getContractHelper().getWrappers().newToken()
                                .transfer(address, privateKey, weiAmount, weiGasPrice, (err, res) => {
                                    console.log('Send tx', err, res)
                                    if (!err) {
                                        self.helpers().cachePendingTransaction(res, address, amount)
                                        browserHistory.push(constants.PAGE_WALLET)
                                        self.helpers().showSnackbar('Successfully sent transaction')
                                    } else
                                        self.helpers().showSnackbar('Error sending transaction')
                                })
                        else
                            helper.getContractHelper().getWrappers().oldToken()
                                .transfer(address, privateKey, weiAmount, weiGasPrice, (err, res) => {
                                    console.log('Send tx', err, res)
                                    if (!err) {
                                        self.helpers().cachePendingTransaction(res, address, amount)
                                        browserHistory.push(constants.PAGE_WALLET)
                                    } else
                                        self.helpers().showSnackbar('Error sending transaction')
                                })
                    }}
                    onClose={() => {
                        self.helpers().toggleDialog(DIALOG_TRANSACTION_CONFIRMATION, false)
                    }}
                />
            }
        }
    }

    helpers = () => {
        const self = this
        return {
            toggleDialog: (type, open) => {
                let dialogs = self.state.dialogs
                if (type == DIALOG_ERROR)
                    dialogs.error.open = open
                else if (type == DIALOG_TRANSACTION_CONFIRMATION &&
                    ((open && self.helpers().canSend()) || !open))
                    dialogs.transactionConfirmation.open = open
                else if (type == DIALOG_PASSWORD_ENTRY)
                    dialogs.password.open = open
                self.setState({
                    dialogs: dialogs
                })
            },
            canSend: () => {
                return self.helpers().getTokenBalance() != constants.TOKEN_BALANCE_LOADING &&
                       parseFloat(self.state.enteredValue) > 0 &&
                       parseFloat(self.state.enteredValue) <= self.helpers().getTokenBalance()
            },
            cachePendingTransaction: (txHash, to, amount) => {
                pendingTxHandler.cacheTx(self.state.selectedTokenContract, txHash, to, amount)
            },
            showSnackbar: (message) => {
                let snackbar = self.state.snackbar
                snackbar.message = message
                snackbar.open = true
                self.setState({
                    snackbar: snackbar
                })
            },
            getTokenBalance: () => {
                let tokenBalance
                switch (self.state.selectedTokenContract) {
                    case constants.TOKEN_TYPE_DBET_TOKEN_NEW:
                        tokenBalance = (self.state.balances.newToken.loading) ?
                            constants.TOKEN_BALANCE_LOADING :
                            self.state.balances.newToken.amount
                        break
                    case constants.TOKEN_TYPE_DBET_TOKEN_OLD:
                        tokenBalance = (self.state.balances.oldToken.loading) ?
                            constants.TOKEN_BALANCE_LOADING :
                            self.state.balances.oldToken.amount
                        break
                }
                console.log('getTokenBalance', tokenBalance)
                return tokenBalance
            },

            areDialogsOpen: () => {
                return (self.state.dialogs.error.open ||
                self.state.dialogs.password.open ||
                self.state.dialogs.transactionConfirmation.open)
            }
        }
    }

    // Return to the previous page
    onBackListener = () => browserHistory.push(constants.PAGE_WALLET)

    // Adds all available fund to selected value
    onSelectAllListener = () => {
        this.setState({
            enteredValue: this.helpers().getTokenBalance()
        })
    }

    // 'Send' button has been pressed
    onSendListener = () => {
        this.helpers().toggleDialog(DIALOG_PASSWORD_ENTRY, true)
    }

    // Value has been changed on the keyboard
    onKeyboardValueChangedListener = enteredValue => {
        this.setState({enteredValue: enteredValue})
    }

    renderActionsPanel = () => {
        return (
            <div className='calculator-actions'>
                <ActionsPanel
                    canSend={this.helpers().canSend()}
                    onSelectAllListener={this.onSelectAllListener}
                    onSendListener={this.onSendListener} 
                    tokenBalance={this.helpers().getTokenBalance()}
                    />
            </div>
        )
    }

    renderHeader = () => {
        return (
            <header className="container">
                <FlatButton
                    label="Back"
                    onClick={this.onBackListener}
                    icon={<i className='fa fa-undo' />}
                />
            </header>
        )
    }

    renderBalance = () => {
        let imgSrc = `${process.env.PUBLIC_URL}/assets/img/icons/dbet.png`
        let tokenBalance = this.helpers().getTokenBalance()
        return (
            <div className="balance px-4 my-auto">
                <div className="row h-100 px-4">
                    <div className="col my-auto">
                        <p>
                            <img src={imgSrc} alt='dbet-logo' />
                            {tokenBalance} DBETs available
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    renderKeyboard = () => {
        return (
            <Keyboard
                enteredValue={this.state.enteredValue}
                isAnyDialogOpen={this.helpers().areDialogsOpen()}
                onKeyboardValueChangedListener={this.onKeyboardValueChangedListener}
                onSelectAllListener={this.onSelectAllListener}
                onSendListener={this.onSendListener}
                />
        )
    }

    renderSnackbar = () => {
        return (
            <MuiThemeProvider muiTheme={themes.getSnackbar()}>
                <Snackbar
                    message={this.state.snackbar.message}
                    open={this.state.snackbar.open}
                    autoHideDuration={3000}
                />
            </MuiThemeProvider>
        )
    }

    render() {
        return (
            <div className="send">
                
                {this.renderHeader()}

                <div className="container calculator-wrapper">
                    <div className='calculator-keyboard'>
                        {this.renderBalance()}
                        <section className="entry">
                            <div>{this.state.enteredValue}</div>
                        </section>
                        {this.renderKeyboard()}
                    </div>

                    {this.renderActionsPanel()}
                </div>
                {this.dialogs().error()}
                {this.dialogs().transactionConfirmation()}
                {this.dialogs().passwordEntry()}
                {this.renderSnackbar()}
            </div>
        )
    }
}

export default Send