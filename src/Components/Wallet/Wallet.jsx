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

class Wallet extends Component {
    constructor(props) {
        super(props)
        i18n = getI18nFn(props.intl, messages)
        TOKEN_BALANCE_LOADING = i18n('Loading')
        this.state = new WalletState(props.selectedTokenContract)
        this.notificationSystem = React.createRef()
    }

    componentDidMount = () => {
        this.initData()
        this.initWatchers()
    }

    static getDerivedStateFromProps(props, state) {
        if (props.selectedTokenContract !== state.selectedTokenContract) {
            return {
                selectedTokenContract: props.selectedTokenContract
            }
        }
        return null
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            this.props.selectedTokenContract !== prevState.selectedTokenContract
        ) {
            this.refresh()
        }
    }

    refresh = () => {
        this.clearData()
        this.initData()
        this.initWatchers()
    }

    isLoadingTransactions() {
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
        if (
            this.state.selectedTokenContract ===
            constants.TOKEN_TYPE_DBET_TOKEN_VET
        ) {
            this.setState({ address: window.thor.eth.defaultAccount.toLowerCase() })
            this.getVETTokenBalance()
            this.vthoBalance()
        } else {
            let address = helper.getWeb3().eth.defaultAccount.toLowerCase()
            this.setState({ address })
            this.ethBalance()
            this.pendingTransactions()
        }
        this.getEthTokenBalances()
    }

    initWatchers = () => {
        if (
            this.state.selectedTokenContract !==
            constants.TOKEN_TYPE_DBET_TOKEN_VET
        ) {
            this.parseTransactions()
        } else if (
            this.state.selectedTokenContract ===
            constants.TOKEN_TYPE_DBET_TOKEN_VET
        ) {
            this.listVETTransactions()
        }
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

    ethBalance = () => {
        helper
            .getWeb3()
            .eth.getBalance(
                helper.getWeb3().eth.defaultAccount,
                (err, balance) => {
                    if (!err) {
                        let balances = this.state.balances
                        balances.eth = {
                            loading: false,
                            amount: helper.formatEther(balance.toString())
                        }
                        this.setState({ balances: balances })
                    }
                }
            )
    }

    vthoBalance = async () => {
        try {
            // VET balance
            const balance = await window.thor.eth.getEnergy(
                window.thor.eth.defaultAccount
            )
            let balances = this.state.balances
            balances.vet = {
                loading: false,
                amount: helper.formatEther(balance.toString())
            }
            this.setState({ balances: balances })
            return
        } catch (e) {
            log.error(`Wallet.jsx: vthoBalance: ${e.message}`)
            console.log(e)
        }
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
    /**
     * Ethereum v1/v2 Token Balance
     */
    getEthTokenBalances = async () => {
        try {
            const contracts = helper.getContractHelper()
            const v1TokenBalance = await contracts.V1Token.balanceOf(
                helper.getWeb3().eth.defaultAccount
            )
            const v2TokenBalance = await contracts.V2Token.balanceOf(
                helper.getWeb3().eth.defaultAccount
            )

            const hasV1Balance = v1TokenBalance > 0
            const hasV2Balance = v2TokenBalance > 0
            if (
                (hasV1Balance || hasV2Balance) &&
                this.state.selectedTokenContract ===
                    constants.TOKEN_TYPE_DBET_TOKEN_VET
            ) {
                this.showVETTokenUpgradeNotification(
                    v1TokenBalance,
                    v2TokenBalance
                )
            }

            let balances = this.state.balances
            balances.newToken = {
                loading: false,
                amount: v2TokenBalance
            }
            balances.oldToken = {
                loading: false,
                amount: v1TokenBalance
            }
            this.setState({ balances: balances })
        } catch (err) {
            log.error(`Wallet.jsx: dbetBalance: ${err.stack}`)
            console.log('dbetBalance newToken err', err.stack)
        }
    }

    pendingTransactions = () => {
        pendingTxHandler.getTxs().forEach(this.parsePendingTransaction)
    }

    parsePendingTransaction = tx => {
        helper.getWeb3().eth.getTransaction(tx.hash, (err, _tx) => {
            let transactions = this.state.transactions
            if (!err) {
                if (!_tx && tx.tokenType === this.state.selectedTokenContract) {
                    // Remove pending tx if it has been stuck at pending for a day or more
                    if (tx.timestamp <= helper.getTimestamp() - 86400)
                        pendingTxHandler.removeTx(tx.hash)
                    else this.addPendingTransaction(tx, transactions)
                } else this.switchPendingTransactionToConfirmed(tx, _tx)
            } else {
                if (tx.tokenType === this.state.selectedTokenContract)
                    this.addPendingTransaction(tx, transactions)
            }
            this.setState({ transactions: transactions })
        })
    }

    getBlock = (blockNumber, callback) => {
        helper.getWeb3().eth.getBlock(blockNumber, callback)
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

    getTokenBalance = () => {
        switch (this.state.selectedTokenContract) {
            case constants.TOKEN_TYPE_DBET_TOKEN_NEW:
                return this.state.balances.newToken.loading
                    ? TOKEN_BALANCE_LOADING
                    : helper.formatDbets(this.state.balances.newToken.amount)
            case constants.TOKEN_TYPE_DBET_TOKEN_OLD:
                return this.state.balances.oldToken.loading
                    ? TOKEN_BALANCE_LOADING
                    : helper.formatDbets(this.state.balances.oldToken.amount)
            case constants.TOKEN_TYPE_DBET_TOKEN_VET:
                return this.state.balances.newVETToken.loading
                    ? TOKEN_BALANCE_LOADING
                    : helper.formatDbets(this.state.balances.newVETToken.amount)
            default:
                //Should not happen
                return ''
        }
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
        this.updateVETUpgradeStatus(null)
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

    /**
     * Main ETH to VET Upgrade call
     */
    onVETUpgradeListener = async () => {
        this.updateVETUpgradeStatus(null)

        const contracts = helper.getContractHelper()

        let V1TokenBalance = this.state.balances.oldToken.amount
        let V2TokenBalance = this.state.balances.newToken.amount
        const vetAddress = keyHandler.getPubAddress()
        // QA Values, needs to be removed for alpha, beta or production
        // V1TokenBalance = 18080000000000000
        // V2TokenBalance = 18080000000000000

        try {
            contracts.DepositToVET.onProgress.subscribe(i => {
                this.updateVETUpgradeStatus(i.status)
            })
            const address = helper.getWeb3().eth.defaultAccount
            await this.depositToken({
                version: `V1`,
                balance: V1TokenBalance,
                vetAddress
            })
            await this.depositToken({
                version: `V2`,
                balance: V2TokenBalance,
                vetAddress
            })

            try {
                const checkV1TokenDeposit = (_address, amount, isV2, index) => {
                    console.log(`V1 index: ${index}`)
                    return (
                        _address === address &&
                        amount.toString() === V1TokenBalance.toString() &&
                        isV2 === false
                    )
                }
                const checkV2TokenDeposit = (_address, amount, isV2, index) => {
                    console.log(`V2 index: ${index}`)
                    return (
                        _address === address &&
                        amount.toString() === V2TokenBalance.toString() &&
                        isV2 === true
                    )
                }

                await contracts.DepositToVET.watchForDeposits(
                    checkV1TokenDeposit,
                    checkV2TokenDeposit,
                    log => {
                        console.log(log)
                        let transactions = this.state.transactions
                        transactions = {
                            ...transactions,
                            pending: {
                                ...transactions.pending,
                                log
                            }
                        }
                        // transactions.loading.to = false
                        // transactions.loading.from = false
                        this.setState({ transactions })
                    }
                )
            } catch (err) {
                console.log(`Timeout`)
            }
            this.refresh()
        } catch (e) {
            log.error(`Wallet.jsx: onVETUpgradeListener: ${e.message}`)
            this.toggleDialog(DIALOG_ERROR, true)
        }

        this.updateVETUpgradeStatus(null)
        this.toggleDialog(DIALOG_VET_TOKEN_UPGRADE, false)
    }

    onUpgradeListener = () => {
        const contracts = helper.getContractHelper()
        let privateKey = this.state.dialogs.upgrade.tokenUpgrade.key
        let address = keyHandler.getAddress()
        let oldTokenBalance = this.state.balances.oldToken.amount

        let callback = (err, res) => {
            if (!err) {
                this.cachePendingTransaction(
                    res,
                    helper.getWeb3().eth.defaultAccount,
                    helper.formatDbets(oldTokenBalance)
                )
                this.refresh()
            } else {
                this.toggleDialog(DIALOG_ERROR, true)
            }
            this.toggleDialog(DIALOG_TOKEN_UPGRADE, false)
        }

        contracts.V1Token.upgrade(
            address,
            privateKey,
            oldTokenBalance,
            callback
        )
    }

    renderTokenUpgradeDialog = () => {
        let balance = this.state.balances.oldToken.loading
            ? TOKEN_BALANCE_LOADING
            : helper.formatDbets(this.state.balances.oldToken.amount)
        let ethBalance = this.state.balances.eth.loading
            ? TOKEN_BALANCE_LOADING
            : this.state.balances.eth.amount
        return (
            <TokenUpgradeDialog
                open={this.state.dialogs.upgrade.tokenUpgrade.open}
                balance={balance}
                ethBalance={ethBalance}
                onUpgrade={this.onUpgradeListener}
                onClose={this.onTokenUpgradeDialogCloseListener}
            />
        )
    }

    renderVETTokenUpgradeDialog = () => {
        const vetPubAddress = keyHandler.getPubAddress()
        let v1Balance = this.state.balances.oldToken.loading
            ? TOKEN_BALANCE_LOADING
            : helper.formatDbets(this.state.balances.oldToken.amount)
        let v2Balance = this.state.balances.newToken.loading
            ? TOKEN_BALANCE_LOADING
            : helper.formatDbets(this.state.balances.newToken.amount)
        let ethBalance = this.state.balances.eth.loading
            ? TOKEN_BALANCE_LOADING
            : this.state.balances.eth.amount
        return (
            <VETTokenUpgradeDialog
                open={this.state.dialogs.upgradeToVET.tokenUpgrade.open}
                v1Balance={v1Balance}
                v2Balance={v2Balance}
                ethBalance={ethBalance}
                vetAddress={vetPubAddress}
                status={this.state.dialogs.upgradeToVET.status}
                onUpgrade={this.onVETUpgradeListener}
                onClose={this.onVETTokenUpgradeDialogCloseListener}
            />
        )
    }

    renderTop() {
        let balance = 'Loading'

        if (
            this.getTokenBalance() !== '' &&
            this.getTokenBalance() !== 'Loading'
        ) {
            balance = helper.formatNumber(this.getTokenBalance())
        }
        return (
            <Fragment>
                <WalletHeader
                    selectedTokenContract={this.state.selectedTokenContract}
                    onRefreshListener={this.refresh}
                    address={this.state.address}
                />
                <WalletBalance
                    tokenBalance={balance}
                    onSendListener={this.onSendListener}
                />
            </Fragment>
        )
    }

    render() {
        let transactionsLoaded = !this.isLoadingTransactions()

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
                {this.renderTokenUpgradeDialog()}
                {this.renderVETTokenUpgradeDialog()}
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
                <VETTokenUpgradeNotification
                    v1TokenBalance={this.state.balances.oldToken.amount}
                    v2TokenBalance={this.state.balances.newToken.amount}
                    open={this.state.dialogs.upgradeToVET.snackbar.open}
                    close={() =>
                        this.toggleDialog(DIALOG_MIGRATION_SNACKBAR, false)
                    }
                    onAccept={this.onPasswordDialogOpenListener}
                    onLearnMore={this.onVETLearnMoreDialogOpenListener}
                />
            </div>
        )
    }
}

Wallet.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(injectIntl(Wallet))
