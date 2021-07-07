/* eslint-disable  */
import React, { Component } from 'react'
import {
    Avatar,
    Button,
    Snackbar,
    Card,
    CardHeader,
    CardContent
} from '@material-ui/core'
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
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { componentMessages, getI18nFn } from '../../i18n/componentMessages'
import KeyHandler from '../Base/KeyHandler'
import PendingTxHandler from '../Base/PendingTxHandler'
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
const log = require('electron-log')

const DIALOG_ERROR = 0,
    DIALOG_PASSWORD_ENTRY = 1,
    DIALOG_TRANSACTION_CONFIRMATION = 2

let TOKEN_BALANCE_LOADING

const styles = theme => ({
    button: {
        margin: theme.spacing.unit
    },
    extendedIcon: {
        marginRight: theme.spacing.unit
    }
})

class Send extends Component {
    constructor(props) {
        super(props)
        i18n = getI18nFn(props.intl, messages)
        TOKEN_BALANCE_LOADING = i18n('Loading')
        let address = window.thor.eth.defaultAccount
        console.log('Pending txs', pendingTxHandler.getTxs())
        this.state = new SendState(address, props.selectedTokenContract)
    }

    componentDidMount = () => {
        this.initData()
    }

    componentDidUpdate = (props) => {
        if (props.selectedTokenContract !== this.state.selectedTokenContract) {
            this.setState({
                selectedTokenContract: props.selectedTokenContract
            })
            setTimeout(this.initData)
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
        this.vetTokenBalance()
        this.loadEnergyCost()
    }

    async loadEnergyCost(amount) {
        const contracts = helper.getContractHelper()
        let energyPrice = await contracts.VETToken.getEstimateTransferGas(
            amount
        )
        energyPrice = energyPrice / 1000
        this.setState({ energyPrice })
    }

    async vetTokenBalance() {
        const contracts = helper.getContractHelper()
        const vetAddress = keyHandler.getPubAddress()
        try {
            const balance = await contracts.VETToken.balanceOf(
                vetAddress
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

    toggleDialog = (type, open) => {
        let dialogs = this.state.dialogs

        switch (type) {
            case DIALOG_ERROR:
                dialogs.error.open = open
                break;
            case DIALOG_PASSWORD_ENTRY:
                dialogs.password.open = open
                break;
            case DIALOG_TRANSACTION_CONFIRMATION:
                dialogs.transactionConfirmation.open = open
                break;
            default:
                break;
        }

        this.setState({
            dialogs: dialogs
        })
    }

    get canSend () {
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

    hideSnackbar = () => {
        let snackbar = this.state.snackbar
        if(snackbar.open === true) {
            snackbar.message = ''
            snackbar.open = false
            this.setState({ snackbar: snackbar })
        }
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
    onBackListener = () => this.props.history.push('/')

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
        dialogs.transactionConfirmation.key =
            this.state.selectedTokenContract === constants.TOKEN_TYPE_DBET_TOKEN_VET ?
                keyHandler.get(password).vetPrivateKey :
                keyHandler.get(password).privateKey
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
    onVETConfirmTransactionListener = async (address, amount, gasPrice) => {
        let privateKey = this.state.dialogs.transactionConfirmation.key
        let weiAmount = web3utils.toWei(amount, 'ether')
        console.log(
            'Sending tx',
            address,
            weiAmount,
            this.state.selectedTokenContract
        )

        const contracts = helper.getContractHelper()
        try {
            const res = await contracts.VETToken.transfer(
                privateKey,
                address,
                weiAmount,
                gasPrice * 1000
            )
            console.log(res)
            this.cachePendingTransaction(res, address, weiAmount)
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
                    canSend={this.canSend}
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
                <Button onClick={this.onBackListener}>
                    <FontAwesomeIcon icon="arrow-left" className={this.props.classes.extendedIcon}/>
                    {i18n('Back')}
                </Button>
            </header>
        )
    }

    renderBalance = () => {
        let imgSrc = `${process.env.PUBLIC_URL}/assets/img/icons/dbet.png`
        return (
            <CardHeader
                avatar={<Avatar src={imgSrc} />}
                title={i18n('SendDBETs')}
                subheader={i18n('TokenBalance', {
                    tokenBalance: this.getTokenBalance()
                })}
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
            <Snackbar
                    onClose={this.hideSnackbar}
                    message={this.state.snackbar.message}
                    open={this.state.snackbar.open}
                    autoHideDuration={3000}
                />
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
                    vthoBalance={this.props.vthoBalance}
                    onConfirmTransaction={this.onVETConfirmTransactionListener}
                    onClose={this.onCloseConfirmationDialogListener}
                />
            )
        } else {
            return (
                <TransactionConfirmationDialog
                    open={this.state.dialogs.transactionConfirmation.open}
                    amount={this.state.enteredValue}
                    ethBalance={this.props.ethBalance}
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

Send.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(injectIntl(Send))
