import React, { Component } from 'react'
import {
    FlatButton,
    MuiThemeProvider,
    Snackbar,
    Card,
    CardHeader,
    CardText
} from 'material-ui'
import ConfirmationDialog from '../Base/Dialogs/ConfirmationDialog'
import EventBus from 'eventing-bus'
import Helper from '../Helper'
import PasswordEntryDialog from '../Base/Dialogs/PasswordEntryDialog'
import TransactionConfirmationDialog from './Dialogs/TransferConfirmationDialog.jsx'
import Keyboard from './Keyboard.jsx'
import ActionsPanel from './ActionsPanel.jsx'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import KeyHandler from '../Base/KeyHandler'
import PendingTxHandler from '../Base/PendingTxHandler'
import Themes from '../Base/Themes'

import './send.css'

const helper = new Helper()
const constants = require('../Constants')
const keyHandler = new KeyHandler()
const pendingTxHandler = new PendingTxHandler()
const themes = new Themes()

const DIALOG_ERROR = 0,
    DIALOG_PASSWORD_ENTRY = 1,
    DIALOG_TRANSACTION_CONFIRMATION = 2

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

    componentWillReceiveProps = props => {
        if (props.selectedTokenContract !== this.state.selectedTokenContract) {
            this.setState({
                selectedTokenContract: props.selectedTokenContract
            })
            this.initData()
        }
    }

    initData = () => {
        if (window.web3Loaded) this.initWeb3Data()
        else {
            let web3Loaded = EventBus.on('web3Loaded', () => {
                this.initWeb3Data()
                // Unregister callback
                web3Loaded()
            })
        }
    }

    initWeb3Data = () => {
        this.ethBalance()
        this.oldTokenBalance()
        this.newTokenBalance()
    }

    oldTokenBalance = () => {
        let callback = balance => {
            balance = helper.formatDbetsMax(balance)
            let balances = this.state.balances
            balances.oldToken = {
                amount: balance,
                loading: false
            }
            this.setState({ balances: balances })
            console.log('Old token balance', balance)
        }

        helper
            .getContractHelper()
            .getWrappers()
            .oldToken()
            .balanceOf(helper.getWeb3().eth.defaultAccount)
            .then(callback)
            .catch(err => {
                console.log('dbetBalance oldToken err', err.message)
            })
    }

    newTokenBalance = () => {
        let callback = balance => {
            balance = helper.formatDbetsMax(balance)
            let balances = this.state.balances
            balances.newToken = {
                amount: balance,
                loading: false
            }
            this.setState({ balances: balances })
            console.log('New token balance', balance)
        }

        helper
            .getContractHelper()
            .getWrappers()
            .newToken()
            .balanceOf(helper.getWeb3().eth.defaultAccount)
            .then(callback)
            .catch(err => {
                console.log('dbetBalance newToken err', err.message)
            })
    }

    ethBalance = () => {
        let callback = (err, balance) => {
            if (!err) {
                balance = parseFloat(
                    helper.getWeb3().fromWei(balance.toString())
                ).toFixed(6)
                console.log('ETH balance', balance)
                this.setState({ ethBalance: balance })
            }
        }
        helper
            .getWeb3()
            .eth.getBalance(helper.getWeb3().eth.defaultAccount, callback)
    }

    toggleDialog = (type, open) => {
        let dialogs = this.state.dialogs
        if (type === DIALOG_ERROR) dialogs.error.open = open
        else if (
            type === DIALOG_TRANSACTION_CONFIRMATION &&
            ((open && this.canSend()) || !open)
        )
            dialogs.transactionConfirmation.open = open
        else if (type === DIALOG_PASSWORD_ENTRY) dialogs.password.open = open
        this.setState({
            dialogs: dialogs
        })
    }

    canSend = () => {
        return (
            this.getTokenBalance() !== constants.TOKEN_BALANCE_LOADING &&
            parseFloat(this.state.enteredValue) > 0 &&
            parseFloat(this.state.enteredValue) <= this.getTokenBalance()
        )
    }

    cachePendingTransaction = (txHash, to, amount) => {
        pendingTxHandler.cacheTx(
            this.state.selectedTokenContract,
            txHash,
            to,
            amount
        )
    }

    showSnackbar = message => {
        let snackbar = this.state.snackbar
        snackbar.message = message
        snackbar.open = true
        this.setState({ snackbar: snackbar })
    }

    getTokenBalance = () => {
        let tokenBalance
        switch (this.state.selectedTokenContract) {
            case constants.TOKEN_TYPE_DBET_TOKEN_NEW:
                tokenBalance = this.state.balances.newToken.loading
                    ? constants.TOKEN_BALANCE_LOADING
                    : this.state.balances.newToken.amount
                break
            case constants.TOKEN_TYPE_DBET_TOKEN_OLD:
                tokenBalance = this.state.balances.oldToken.loading
                    ? constants.TOKEN_BALANCE_LOADING
                    : this.state.balances.oldToken.amount
                break
            default:
                tokenBalance = 0
        }
        console.log('getTokenBalance', tokenBalance)
        return tokenBalance
    }

    areDialogsOpen = () => {
        return (
            this.state.dialogs.error.open ||
            this.state.dialogs.password.open ||
            this.state.dialogs.transactionConfirmation.open
        )
    }

    // Return to the previous page
    onBackListener = () => this.props.history.goBack()

    // Adds all available fund to selected value
    onSelectAllListener = () => {
        this.setState({
            enteredValue: this.getTokenBalance()
        })
    }

    // 'Send' button has been pressed
    onSendListener = () => {
        this.toggleDialog(DIALOG_PASSWORD_ENTRY, true)
    }

    // Value has been changed on the keyboard
    onKeyboardValueChangedListener = enteredValue => {
        this.setState({ enteredValue: enteredValue })
    }

    // Password successfully inserted
    onValidPasswordListener = password => {
        let dialogs = this.state.dialogs
        dialogs.transactionConfirmation.key = keyHandler.get(password)
        this.setState({ dialogs: dialogs })
        this.toggleDialog(DIALOG_PASSWORD_ENTRY, false)
        this.toggleDialog(DIALOG_TRANSACTION_CONFIRMATION, true)
    }

    // Sends the transaction.
    onConfirmTransactionListener = (address, amount, gasPrice) => {
        let privateKey = this.state.dialogs.transactionConfirmation.key
        let weiAmount = helper.getWeb3().toWei(amount, 'ether')
        let weiGasPrice = helper.getWeb3().toWei(gasPrice, 'gwei')
        console.log(
            'Sending tx',
            address,
            weiAmount,
            weiGasPrice,
            this.state.selectedTokenContract
        )

        // TODO: Async/Await this
        let callback = (err, res) => {
            console.log('Send tx', err, res)
            if (!err) {
                this.cachePendingTransaction(res, address, amount)
                this.props.history.push('/')
                this.showSnackbar('Successfully sent transaction')
            } else {
                this.showSnackbar('Error sending transaction')
            }
        }

        if (
            this.state.selectedTokenContract ===
            constants.TOKEN_TYPE_DBET_TOKEN_NEW
        ) {
            helper
                .getContractHelper()
                .getWrappers()
                .newToken()
                .transfer(address, privateKey, weiAmount, weiGasPrice, callback)
        } else {
            helper
                .getContractHelper()
                .getWrappers()
                .oldToken()
                .transfer(address, privateKey, weiAmount, weiGasPrice, callback)
        }
    }

    onClosePasswordDialogListener = () =>
        this.toggleDialog(DIALOG_PASSWORD_ENTRY, false)

    onCloseErrorDialogListener = () => this.toggleDialog(DIALOG_ERROR, false)

    onCloseConfirmationDialogListener = () =>
        this.toggleDialog(DIALOG_TRANSACTION_CONFIRMATION, false)

    renderActionsPanel = () => {
        return (
            <div className="calculator-actions">
                <ActionsPanel
                    canSend={this.canSend()}
                    onSelectAllListener={this.onSelectAllListener}
                    onSendListener={this.onSendListener}
                    tokenBalance={this.getTokenBalance()}
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
                    icon={<FontAwesomeIcon icon="arrow-left" />}
                />
            </header>
        )
    }

    renderBalance = () => {
        let imgSrc = `${process.env.PUBLIC_URL}/assets/img/icons/dbet.png`
        let tokenBalance = this.getTokenBalance()
        return (
            <CardHeader
                title="Send DBETs"
                subtitle={`${tokenBalance} DBETs available in your account`}
                avatar={imgSrc}
            />
        )
    }

    renderKeyboard = () => {
        return (
            <CardText>
                <Keyboard
                    enteredValue={this.state.enteredValue}
                    isAnyDialogOpen={this.areDialogsOpen()}
                    onKeyboardValueChangedListener={
                        this.onKeyboardValueChangedListener
                    }
                    onSelectAllListener={this.onSelectAllListener}
                    onSendListener={this.onSendListener}
                />
            </CardText>
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

    renderErrorDialog = () => {
        return (
            <ConfirmationDialog
                onClick={this.onCloseErrorDialogListener}
                onClose={this.onCloseErrorDialogListener}
                title={this.state.dialogs.error.title}
                message={this.state.dialogs.error.message}
                open={this.state.dialogs.error.open}
            />
        )
    }

    renderPasswordEntryDialog = () => {
        return (
            <PasswordEntryDialog
                open={this.state.dialogs.password.open}
                onValidPassword={this.onValidPasswordListener}
                onClose={this.onClosePasswordDialogListener}
            />
        )
    }

    renderTransactionConfirmationDialog = () => {
        return (
            <TransactionConfirmationDialog
                open={this.state.dialogs.transactionConfirmation.open}
                amount={this.state.enteredValue}
                ethBalance={this.state.ethBalance}
                onConfirmTransaction={this.onConfirmTransactionListener}
                onClose={this.onCloseConfirmationDialogListener}
            />
        )
    }

    render() {
        return (
            <div className="send">
                {this.renderHeader()}
                <div className="container calculator-wrapper">
                    <Card className="calculator-keyboard">
                        {this.renderBalance()}
                        <Card className="entry">
                            <div>{this.state.enteredValue}</div>
                        </Card>
                        {this.renderKeyboard()}
                    </Card>

                    {this.renderActionsPanel()}
                </div>
                {this.renderErrorDialog()}
                {this.renderTransactionConfirmationDialog()}
                {this.renderPasswordEntryDialog()}
                {this.renderSnackbar()}
            </div>
        )
    }
}

export default Send
