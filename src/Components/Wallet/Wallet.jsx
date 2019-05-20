/* eslint-disable no-console */
import React, { Component, Fragment } from 'react'
import { injectIntl } from 'react-intl'
import { componentMessages, getI18nFn } from '../../i18n/componentMessages'
import EventBus from 'eventing-bus'
import Helper from '../Helper'
import KeyHandler from '../Base/KeyHandler'
import PendingTxHandler from '../Base/PendingTxHandler'
import { WalletState } from './Models/WalletState'
import ConfirmationDialog from '../Base/Dialogs/ConfirmationDialog'
import PasswordEntryDialog from '../Base/Dialogs/PasswordEntryDialog'
import TokenUpgradeDialog from './Dialogs/TokenUpgradeDialog'
import VETTokenUpgradeDialog from './Dialogs/VETTokenUpgradeDialog'
import LearnMoreDialog from './Dialogs/LearnMoreDialog'
import VETLearnMoreDialog from './Dialogs/VETLearnMoreDialog'
import ConfirmedTransactionList from './ConfirmedTransactionList'
import PendingTransactionsList from './PendingTransactionList'
import WalletBalance from './WalletBalance'
import WalletHeader from './WalletHeader'
import VETTokenUpgradeNotification from './VETTokenUpgradeNotification'
import { BigNumber } from 'bignumber.js'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

const web3utils = require('web3-utils')

const log = require('electron-log')
let i18n
const messages = componentMessages('src.Components.Wallet.Wallet', [
    { Loading: 'common.Loading' }
])
const constants = require('../Constants')
const helper = new Helper()
const keyHandler = new KeyHandler()
const pendingTxHandler = new PendingTxHandler()

const DIALOG_LEARN_MORE = 0,
    DIALOG_TOKEN_UPGRADE = 1,
    DIALOG_PASSWORD_ENTRY = 2,
    DIALOG_ERROR = 3,
    DIALOG_VET_TOKEN_UPGRADE = 4,
    DIALOG_VET_LEARN_MORE = 5,
    DIALOG_MIGRATION_SNACKBAR = 6

let TOKEN_BALANCE_LOADING

const styles = () => ({
    wrapper: {
        width: '900px',
        marginTop: '70px'
    },
    progress: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    transactions: {
        margin: '20px 0px',
        '& .transactions .icon': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: '0 5rem'
        },
        '& .transactions .icon svg': {
            color: '#f2b45c',
            width: '2rem',
            height: '2rem'
        },
        '& .transactions .tx': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexFlow: 'row nowrap',
            padding: '20px 0px',
            wordBreak: 'break-all'
        },
        '& .transactions .tx .value': {
            fontSize: '2.25rem',
            fontFamily: 'monospace'
        },
        '& .transactions .hash': {
            fontFamily: 'monospace',
            fontSize: '1em !important'
        },
        '& .transactions .text': {
            marginRight: '1em',
            flex: 1,
            fontFamily: 'sans-serif'
        },
        '& .transactions .text > *:not(:last-of-type)': {
            paddingBottom: '5px'
        },
        '& .transactions': {
            flex: '0 10rem'
        },
        '& .transactions .tx .monospace': {
            fontFamily: 'monospace'
        }
    }
})

let progressBarSubscription

class Wallet extends Component {
    constructor(props) {
        super(props)
        i18n = getI18nFn(props.intl, messages)
        TOKEN_BALANCE_LOADING = i18n('Loading')
        this.state = new WalletState(props.selectedTokenContract)
        this.notificationSystem = React.createRef()
    }

    componentWillUnmount() {
        if (progressBarSubscription) {
            progressBarSubscription.unsubscribe()
        }
    }

    componentDidMount = async () => {
        await this.initData()
        await this.initWatchers()
    }

    get isLoading() {
        let { newVETToken, vet } = this.state.balances
        return (
            newVETToken.loading || vet.loading || this.isLoadingTransactions
        )
    }

    static getDerivedStateFromProps(props, state) {
        if (props.selectedTokenContract !== state.selectedTokenContract) {
            return {
                selectedTokenContract: props.selectedTokenContract
            }
        }
        return null
    }

    async componentDidUpdate(prevProps, prevState) {
        if (
            this.props.selectedTokenContract !== prevState.selectedTokenContract
        ) {
            await this.refresh()
        }
    }

    refresh = async () => {
        this.clearData()
        await this.initData()
        await this.initWatchers()
    }

    get isLoadingTransactions() {
        let { transactions } = this.state

        return transactions.loading.from || transactions.loading.to
    }

    clearData = () => {
        let balances = this.state.balances
        balances.newToken.loading = true
        balances.oldToken.loading = true
        balances.eth.loading = true
        balances.newVETToken.loading = true
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

    initData = async () => {
        if (window.web3Loaded) {
            await this.initWeb3Data()
        } else {
            let web3Loaded = EventBus.on('web3Loaded', async () => {
                await this.initWeb3Data()
                // Unregister callback
                web3Loaded()
            })
        }
    }

    initWeb3Data = async () => {
        this.setState({
            address: window.thor.eth.defaultAccount.toLowerCase()
        })
        await this.getVETTokenBalance()

        let balances = this.state.balances
        balances.vet = {
            loading: false,
            amount: this.props.vthoBalance
        }

        balances.eth = {
            loading: false,
            amount: this.props.ethBalance
        }
        this.setState({ balances: balances })
    }

    initWatchers = async () => {
        await this.listVETTransactions();
    }

    async listVETTransactions() {
        const vetPubAddress = keyHandler.getPubAddress()
        const contracts = helper.getContractHelper()
        let transactions = this.state.transactions
        const txs = await contracts.VETToken.getTransactionLogs(vetPubAddress)

        transactions = {
            ...transactions,
            confirmed: {
                ...txs
            }
        }
        transactions.loading.to = false
        transactions.loading.from = false
        this.setState({ transactions })
    }

    parseTransactions = async () => {
        const contracts = helper.getContractHelper()
        let logs = await contracts[
            this.state.selectedTokenContract ===
            constants.TOKEN_TYPE_DBET_TOKEN_OLD
                ? 'V1Token'
                : 'V2Token'
        ].getTransferEventLogs()

        let transactions = this.state.transactions
        transactions.loading.to = false
        transactions.loading.from = false
        const update = this.addConfirmedTransactions(logs, transactions)

        // console.log('Transactions', transactions, logs)
        this.setState({ transactions: update })
    }
    /**
     * VET Token Balance
     */
    getVETTokenBalance = async () => {
        try {
            const vetAddress = keyHandler.getPubAddress()
            const contracts = helper.getContractHelper()
            const amount = await contracts.VETToken.balanceOf(vetAddress)

            let balances = this.state.balances
            balances.newVETToken = {
                loading: false,
                amount
            }
            this.setState({ balances })
        } catch (err) {
            log.error(`Wallet.jsx: getVETTokenBalance: ${err.message}`)
            console.log('dbetBalance VET token err', err.message)
        }
    }
    
    

    pendingTransactions = () => {
        pendingTxHandler.getTxs().forEach(this.parsePendingTransaction)
    }

    
   

    addConfirmedTransactions = (res, transactions) => {
        const items = res.map(tx => {
            const { from, to, value } = tx.returnValues
            pendingTxHandler.removeTx(tx.transactionHash)
            let amount = helper.formatDbets(new BigNumber(value))
            let timestamp = new BigNumber(tx.timestamp)
            let newTx = {
                block: {
                    timestamp,
                    number: tx.blockNumber
                },
                hash: tx.transactionHash,
                from: from.toLowerCase(),
                to: to.toLowerCase(),
                value: amount
            }

            return newTx
        })
        const txs = {}
        items.forEach(i => {
            txs[i.hash] = {
                ...i
            }
        })
        return {
            ...transactions,
            confirmed: {
                ...txs
            }
        }
    }

    switchPendingTransactionToConfirmed = (pendingTx, networkTx) => {
        let transactions = this.state.transactions
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
    }

    addPendingTransaction = (tx, transactions) => {
        transactions.pending[tx.hash] = tx
    }

    cachePendingTransaction = (txHash, to, amount) => {
        pendingTxHandler.cacheTx(
            this.state.selectedTokenContract,
            txHash,
            to,
            amount
        )
    }

    /***
     * Displays VET Token Migration Popup
     */
    showVETTokenUpgradeNotification = () => {
        this.toggleDialog(DIALOG_MIGRATION_SNACKBAR, true)
    }

    get tokenBalance() {
        let dbets
        let balanceIsLoading = true

        balanceIsLoading = this.state.balances.newVETToken.loading
        dbets = this.state.balances.newVETToken.amount

        if(!balanceIsLoading) {
            const balance =  helper.formatDbets(dbets)
            return helper.formatNumber(balance)
        }

        return TOKEN_BALANCE_LOADING
    }

    toggleDialog = (type, open) => {
        let dialogs = this.state.dialogs
        if (type === DIALOG_LEARN_MORE) {
            dialogs.upgrade.learnMore.open = open
        } else if (type === DIALOG_TOKEN_UPGRADE) {
            dialogs.upgrade.tokenUpgrade.open = open
        } else if (type === DIALOG_MIGRATION_SNACKBAR) {
            dialogs.upgradeToVET.snackbar.open = open
        }
        if (type === DIALOG_VET_LEARN_MORE) {
            dialogs.upgradeToVET.learnMore.open = open
        } else if (type === DIALOG_VET_TOKEN_UPGRADE) {
            dialogs.upgradeToVET.tokenUpgrade.open = open
        } else if (type === DIALOG_PASSWORD_ENTRY) dialogs.password.open = open
        else if (type === DIALOG_ERROR) dialogs.error.open = open
        this.setState({ dialogs: dialogs })
    }

    onVETUpgradeOpenListener = async () => {
        const vetPubAddress = keyHandler.getPubAddress()
        let v1Balance = this.state.balances.oldToken.amount
        let v2Balance = this.state.balances.newToken.amount

        const contracts = helper.getContractHelper()
        let gasEstimates = 0
        if (v1Balance && v1Balance > 0) {
            // read gas estimate
            gasEstimates = await contracts.V1Token.getEstimateSwapGas(
                vetPubAddress,
                v1Balance
            )
        }
        if (v2Balance && v2Balance > 0) {
            // read gas estimate
            gasEstimates += await contracts.V2Token.getEstimateSwapGas(
                vetPubAddress,
                v2Balance
            )
        }

        const cost = new BigNumber(gasEstimates)
        const n = cost.dividedBy(1000000000).toFixed()
        const swapEthCost = n // web3utils.fromWei(n.toString(),'gwei')
        this.setState({ swapEthCost })

        this.onPasswordDialogOpenListener()
    }

    onPasswordDialogOpenListener = () =>
        this.toggleDialog(DIALOG_PASSWORD_ENTRY, true)

    onLearnMoreDialogOpenListener = () =>
        this.toggleDialog(DIALOG_LEARN_MORE, true)

    onVETLearnMoreDialogOpenListener = () =>
        this.toggleDialog(DIALOG_VET_LEARN_MORE, true)

    onLearnMoreDialogCloseListener = () =>
        this.toggleDialog(DIALOG_LEARN_MORE, false)

    onTokenUpgradeDialogCloseListener = () =>
        this.toggleDialog(DIALOG_TOKEN_UPGRADE, false)

    onVETLearnMoreDialogCloseListener = () =>
        this.toggleDialog(DIALOG_VET_LEARN_MORE, false)

    onVETTokenUpgradeDialogCloseListener = () => {
        this.updateVETUpgradeStatus({ hide: true })
        this.toggleDialog(DIALOG_VET_TOKEN_UPGRADE, false)
    }

    onTokenUpgradeErrorDialogCloseListener = () =>
        this.toggleDialog(DIALOG_ERROR, false)

    onPasswordEntryDialogCloseListener = () =>
        this.toggleDialog(DIALOG_PASSWORD_ENTRY, false)

    onSendListener = () => this.props.history.push('/send')

    onPasswordListener = password => {
        let dialogs = this.state.dialogs
        const { privateKey } = keyHandler.get(password)
        this.toggleDialog(DIALOG_PASSWORD_ENTRY, false)
        if (
            this.state.selectedTokenContract ===
            constants.TOKEN_TYPE_DBET_TOKEN_VET
        ) {
            dialogs.upgradeToVET.tokenUpgrade.key = privateKey
            this.toggleDialog(DIALOG_VET_TOKEN_UPGRADE, true)
        } else {
            dialogs.upgrade.tokenUpgrade.key = privateKey
            this.toggleDialog(DIALOG_TOKEN_UPGRADE, true)
        }

        this.setState({ dialogs: dialogs })
    }

    updateVETUpgradeStatus(message) {
        const { dialogs } = this.state
        this.setState({
            dialogs: {
                ...dialogs,
                upgradeToVET: {
                    ...dialogs.upgradeToVET,
                    status: message
                }
            }
        })
    }

    /**
     * Generic  function that deposits to V1 or V2 token contracts
     */
    async depositToken({ version, balance, vetAddress }) {
        const address = helper.getWeb3().eth.defaultAccount
        const contracts = helper.getContractHelper()
        const privateKey = this.state.dialogs.upgradeToVET.tokenUpgrade.key
        if (balance > 0) {
            this.updateVETUpgradeStatus(`Starting ${version} token upgrade`)
            const done = await contracts[
                `${version}Token`
            ].approveWithConfirmation(privateKey, address, balance)

            if (done) {
                await contracts.DepositToVET.depositToken({
                    privateKey,
                    isV2: version === 'V2',
                    balance,
                    vetAddress
                })
            }
        }
    }


    renderTop() {
        const address = keyHandler.getPubAddress()
        return (
            <Fragment>
                <WalletHeader
                    isLoading={this.isLoading}
                    selectedTokenContract={this.state.selectedTokenContract}
                    onRefreshListener={this.refresh}
                    address={address}
                />
                <WalletBalance
                    isLoading={this.isLoading}
                    tokenBalance={this.tokenBalance}
                    onSendListener={this.onSendListener}
                />
            </Fragment>
        )
    }

    render() {
        let transactionsLoaded = !this.isLoadingTransactions

        return (
            <div className={this.props.classes.wrapper}>
                {this.renderTop()}
                <div className={this.props.classes.transactions}>
                    <PendingTransactionsList
                        pendingTransactionsList={
                            this.state.transactions.pending
                        }
                    />
                    <ConfirmedTransactionList
                        transactionList={this.state.transactions.confirmed}
                        transactionsLoaded={transactionsLoaded}
                        walletAddress={this.state.address}
                    />
                </div>
                <LearnMoreDialog
                    isOpen={this.state.dialogs.upgrade.learnMore.open}
                    onCloseListener={this.onLearnMoreDialogCloseListener}
                />
                <VETLearnMoreDialog
                    isOpen={this.state.dialogs.upgradeToVET.learnMore.open}
                    onCloseListener={this.onVETLearnMoreDialogCloseListener}
                />
                <PasswordEntryDialog
                    open={this.state.dialogs.password.open}
                    onValidPassword={this.onPasswordListener}
                    onClose={this.onPasswordEntryDialogCloseListener}
                />
                <ConfirmationDialog
                    title="Error upgrading tokens"
                    message="Please make sure you have enough ETH to cover the transaction's gas costs"
                    open={this.state.dialogs.error.open}
                    onClick={this.onTokenUpgradeErrorDialogCloseListener}
                    onClose={this.onTokenUpgradeErrorDialogCloseListener}
                />
            </div>
        )
    }
}

Wallet.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(injectIntl(Wallet))
