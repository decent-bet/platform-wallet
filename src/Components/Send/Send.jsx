/* eslint-disable  */
import React, { Component } from 'react'
import {
    Button,
    Snackbar,
    Card,
    CardHeader,
    CardContent
} from '@material-ui/core'
import { MuiThemeProvider } from 'material-ui'
import ConfirmationDialog from '../Base/Dialogs/ConfirmationDialog'
import EventBus from 'eventing-bus'
import Helper from '../Helper'
import PasswordEntryDialog from '../Base/Dialogs/PasswordEntryDialog'
import TransactionConfirmationDialog from './Dialogs/TransferConfirmationDialog.jsx'
import VETTransactionConfirmationDialog from './Dialogs/VETTransferConfirmationDialog.jsx'
import Keyboard from './Keyboard.jsx'
import ActionsPanel from './ActionsPanel.jsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { injectIntl } from 'react-intl'
import { componentMessages, getI18nFn } from '../../i18n/componentMessages'
import KeyHandler from '../Base/KeyHandler'
import PendingTxHandler from '../Base/PendingTxHandler'
import Themes from '../Base/Themes'
import { SendState } from './Models/SendState'
import './send.css'

const web3utils = require('web3-utils')

let i18n
const messages = componentMessages('src.Components.Send.Send', [
    { Back: 'common.Back' },
    { Loading: 'common.Loading' },
    'TokenBalance',
    'SendDBETs'
])

const helper = new Helper()
const constants = require('../Constants')
const keyHandler = new KeyHandler()
const pendingTxHandler = new PendingTxHandler()
const themes = new Themes()
const log = require('electron-log');

const DIALOG_ERROR = 0,
    DIALOG_PASSWORD_ENTRY = 1,
    DIALOG_TRANSACTION_CONFIRMATION = 2

let TOKEN_BALANCE_LOADING

class Send extends Component {
    constructor(props) {
        super(props)
        i18n = getI18nFn(props.intl, messages)
        TOKEN_BALANCE_LOADING = i18n('Loading')
        let address = helper.getWeb3().eth.defaultAccount
        console.log('Pending txs', pendingTxHandler.getTxs())
        this.state = new SendState(address, props.selectedTokenContract)
    }

    componentDidMount = () => {
        this.initData()
    }

    static getDerivedStateFromProps(props, state) {
        if (props.selectedTokenContract !== state.selectedTokenContract) {
            // this.initData()

            return {
                selectedTokenContract: props.selectedTokenContract
            }
        }

        return null
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
        if (this.state.selectedTokenContract === constants.TOKEN_TYPE_DBET_TOKEN_VET) {
            this.vetTokenBalance()
            this.vetBalance()
            this.loadEnergyCost()
        } else {
            this.ethBalance()
            this.oldTokenBalance()
            this.newTokenBalance()
        }
    }

    async loadEnergyCost(amount) {
        const contracts = helper.getContractHelper()
        let energyPrice = await contracts.VETToken.getEstimateTransferGas(amount)
        this.setState({ energyPrice })
    }
    async vetTokenBalance() {
        const contracts = helper.getContractHelper()
        try {
            const balance = await contracts.VETToken.balanceOf(
                helper.getWeb3().eth.defaultAccount
            )
            let balances = this.state.balances
            balances.newVETToken = {
                amount: helper.formatDbetsMax(balance),
                loading: false
            }
            this.setState({ balances: balances })
            console.log('VET token balance', balance)
        } catch (err) {
            console.log('dbetBalance VET token err', err.message)
        }
    }

    async oldTokenBalance() {
        const contracts = helper.getContractHelper()
        try {
            const balance = await contracts.V1Token.balanceOf(
                helper.getWeb3().eth.defaultAccount
            )
            let balances = this.state.balances
            balances.oldToken = {
                amount: helper.formatDbetsMax(balance),
                loading: false
            }
            this.setState({ balances: balances })
            console.log('V1 token balance', balance)
        } catch (err) {
            console.log('dbetBalance V1 err', err.message)
        }
    }

    async newTokenBalance() {
        const contracts = helper.getContractHelper()
        try {
            const balance = await contracts.V2Token.balanceOf(
                helper.getWeb3().eth.defaultAccount
            )
            let balances = this.state.balances
            balances.newToken = {
                amount: helper.formatDbetsMax(balance),
                loading: false
            }
            this.setState({ balances: balances })
            console.log('V2 token balance', balance)
        } catch (err) {
            console.log('dbetBalance V2 err', err.message)
        }
    }

    async vetBalance() {
        try {
            // VET balance
            const vetBalance = await window.thor.eth.getBalance(
                window.thor.eth.defaultAccount
            )

            this.setState({ vetBalance: helper.formatEther(vetBalance) })
            return
        } catch (e) {
            log.error(`Send.jsx: balanceOf newTokenBalance: ${err.message}`)
            console.log(e)
        }
    }

    ethBalance = () => {
        let callback = (err, balance) => {
            if (!err) {
                balance = parseFloat(
                    web3utils.fromWei(balance.toString())
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
            this.getTokenBalance() !== TOKEN_BALANCE_LOADING &&
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
                    ? TOKEN_BALANCE_LOADING
                    : this.state.balances.newToken.amount
                break
            case constants.TOKEN_TYPE_DBET_TOKEN_OLD:
                tokenBalance = this.state.balances.oldToken.loading
                    ? TOKEN_BALANCE_LOADING
                    : this.state.balances.oldToken.amount
                break
            case constants.TOKEN_TYPE_DBET_TOKEN_VET:
                tokenBalance = this.state.balances.newVETToken.loading
                    ? TOKEN_BALANCE_LOADING
                    : this.state.balances.newVETToken.amount
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
        this.loadEnergyCost(this.state.enteredValue)
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
        let weiAmount = web3utils.toWei(amount, 'ether')
        let weiGasPrice = web3utils.toWei(gasPrice, 'gwei')
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
                log.error(`Send.jsx: Error sending transaction: ${err.message}`)
                this.showSnackbar('Error sending transaction')
            }
        }

        const contracts = helper.getContractHelper()
        switch (this.state.selectedTokenContract) {
            case constants.TOKEN_TYPE_DBET_TOKEN_NEW:
                contracts.V2Token.transfer(
                    address,
                    privateKey,
                    weiAmount,
                    weiGasPrice,
                    callback
                )
                return
            case constants.TOKEN_TYPE_DBET_TOKEN_OLD:
                contracts.V1Token.transfer(
                    address,
                    privateKey,
                    weiAmount,
                    weiGasPrice,
                    callback
                )
                return
        }
    }

    // Sends the transaction.
    onVETConfirmTransactionListener = (address, amount, gasPrice) => {
        let privateKey = this.state.dialogs.transactionConfirmation.key
        console.log(
            'Sending tx',
            address,
            amount,
            this.state.selectedTokenContract
        )

        const contracts = helper.getContractHelper()
        try {
            const ok = contracts.VETToken.transfer(
                privateKey,
                address,
                amount,
                gasPrice
            )

            this.props.history.push('/')
            this.showSnackbar('Successfully sent transaction')
        } catch (e) {
            console.log(e)
            this.showSnackbar('Error sending transaction')
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
                <Button
                    label={i18n('Back')}
                    onClick={this.onBackListener}
                    icon={<FontAwesomeIcon icon="arrow-left" />}
                />
            </header>
        )
    }

    renderBalance = () => {
        let imgSrc = `${process.env.PUBLIC_URL}/assets/img/icons/dbet.png`
        return (
            <CardHeader
                title={i18n('SendDBETs')}
                subtitle={i18n('TokenBalance', {
                    tokenBalance: this.getTokenBalance()
                })}
                avatar={imgSrc}
            />
        )
    }

    renderKeyboard = () => {
        return (
            <CardContent>
                <Keyboard
                    enteredValue={this.state.enteredValue}
                    isAnyDialogOpen={this.areDialogsOpen()}
                    onKeyboardValueChangedListener={
                        this.onKeyboardValueChangedListener
                    }
                    onSelectAllListener={this.onSelectAllListener}
                    onSendListener={this.onSendListener}
                />
            </CardContent>
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
        if (
            this.state.selectedTokenContract ===
            constants.TOKEN_TYPE_DBET_TOKEN_VET
        ) {
            return (
                <VETTransactionConfirmationDialog
                    open={this.state.dialogs.transactionConfirmation.open}
                    amount={this.state.enteredValue}
                    energyPrice={this.state.energyPrice}
                    vetBalance={this.state.vetBalance}
                    onConfirmTransaction={this.onVETConfirmTransactionListener}
                    onClose={this.onCloseConfirmationDialogListener}
                />
            )
        } else {
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

export default injectIntl(Send)
