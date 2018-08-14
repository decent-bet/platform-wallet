import React, { Component } from 'react'
import { MuiThemeProvider } from 'material-ui'
import { injectIntl } from 'react-intl'
import { componentMessages, getI18nFn } from '../../i18n/componentMessages'
let i18n
const messages = componentMessages('src.Components.Wallet.Wallet', [
    { Loading: 'common.Loading' }
])
import EtherScan from '../Base/EtherScan'
import EventBus from 'eventing-bus'
import Helper from '../Helper'
import KeyHandler from '../Base/KeyHandler'
import PendingTxHandler from '../Base/PendingTxHandler'
import ReactMaterialUiNotifications from '../Base/Libraries/ReactMaterialUiNotifications'

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
import TokenUpgradeNotification from './TokenUpgradeNotification'
import VETTokenUpgradeNotification from './VETTokenUpgradeNotification'
import { BigNumber } from 'bignumber.js'
import Themes from '../Base/Themes'
import './wallet.css'
import { DepositContractHelper } from '../DepositContractHelper'

const constants = require('../Constants')
const etherScan = new EtherScan()
const helper = new Helper()
const keyHandler = new KeyHandler()
const pendingTxHandler = new PendingTxHandler()
const themes = new Themes()
let depositListener
const DIALOG_LEARN_MORE = 0,
    DIALOG_TOKEN_UPGRADE = 1,
    DIALOG_PASSWORD_ENTRY = 2,
    DIALOG_ERROR = 3,
    DIALOG_VET_TOKEN_UPGRADE = 4,
    DIALOG_VET_LEARN_MORE = 5
let TOKEN_BALANCE_LOADING

class Wallet extends Component {
    constructor(props) {
        super(props)
        i18n = getI18nFn(props.intl, messages)
        TOKEN_BALANCE_LOADING = i18n('Loading')
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
                newVETToken: {
                    loading: true,
                    amount: 0
                },
                eth: {
                    loading: true,
                    amount: 0
                },
                vet: {
                    loading: true,
                    amount: 0
                }
            },
            selectedTokenContract: props.selectedTokenContract,
            address: '',
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
                upgradeToVET: {
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

    componentWillReceiveProps = props => {
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
        // Update address
        let address = helper.getWeb3().eth.defaultAccount.toLowerCase()
        this.setState({ address: address })

        this.ethBalance()
        this.vetBalance()
        this.getEthTokenBalances()
        this.pendingTransactions()

        // Listen for any deposit contract events
        depositListener = new DepositContractHelper(window.thor, helper.getWeb3())
        depositListener.listen()
    }

    initWatchers = () => {
        this.parseOutgoingTransactions()
        this.parseIncomingTransactions()
    }

    parseOutgoingTransactions = () => {
        etherScan.getTransferLogs(true, (err, res) => {
            let transactions = this.state.transactions
            transactions.loading.from = false

            if (!err) {
                this.addConfirmedTransactions(res, transactions)
            }

            console.log('Transactions', transactions, res)
            this.setState({ transactions: transactions })
        })
    }

    parseIncomingTransactions = () => {
        etherScan.getTransferLogs(false, (err, res) => {
            let transactions = this.state.transactions
            transactions.loading.to = false

            if (!err) {
                this.addConfirmedTransactions(res, transactions)
            }

            console.log('Transactions', transactions, res)

            this.setState({ transactions: transactions })
        })
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

    vetBalance = async () => {
        try {
            // VET balance
            const balance = await window.thor.eth.getBalance(
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
            log.error(`Wallet.jsx: vetBalance: ${e.message}`)
            console.log(e)
        }
    }

    /**
     * Ethereum v1/v2 Token Balance
     */
    getEthTokenBalances = async() => {
        try{
            const v1TokenBalance = await helper
                .getContractHelper()
                .getWrappers()
                .oldToken()
                .balanceOf(helper.getWeb3().eth.defaultAccount)
            const v2TokenBalance = await helper
                .getContractHelper()
                .getWrappers()
                .newToken()
                .balanceOf(helper.getWeb3().eth.defaultAccount)


                if (v1TokenBalance > 0) {
                    this.showTokenUpgradeNotification(v1TokenBalance)
                }

                if (v2TokenBalance > 0 && this.state.selectedTokenContract === '2') {
                    this.showVETTokenUpgradeNotification(v1TokenBalance, v2TokenBalance)
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
            }
            catch(err) {
                log.error(`Wallet.jsx: newTokenBalance: ${err.message}`)
                console.log('dbetBalance newToken err', err.message)
            }
    }

    pendingTransactions = () => {
        pendingTxHandler.getTxs().forEach(this.parsePendingTransaction)
    }

    parsePendingTransaction = tx => {
        helper.getWeb3().eth.getTransaction(tx.hash, (err, _tx) => {
            console.log('Retrieved transaction', tx.hash, tx, err, _tx)
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
        res.result.map(tx => {
            pendingTxHandler.removeTx(tx.transactionHash)
            let value = helper.formatDbets(new BigNumber(tx.data))
            let timestamp = new BigNumber(tx.timeStamp)
            let newTx = {
                block: {
                    timestamp: timestamp,
                    number: tx.blockNumber
                },
                hash: tx.transactionHash,
                from: etherScan._unformatAddress(tx.topics[1]),
                to: etherScan._unformatAddress(tx.topics[2]),
                value: value
            }

            transactions.confirmed[tx.transactionHash] = newTx
            return newTx
        })
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

    showTokenUpgradeNotification = oldTokenBalance => {
        let notification = TokenUpgradeNotification(
            oldTokenBalance,
            this.onPasswordDialogOpenListener,
            this.onLearnMoreDialogOpenListener
        )
        ReactMaterialUiNotifications.clearNotifications()
        ReactMaterialUiNotifications.showNotification(notification)
    }

    /***
     * Displays VET Token Migration Popup
     */
    showVETTokenUpgradeNotification = (v1TokenBalance, v2TokenBalance) => {
        let notification = VETTokenUpgradeNotification(
            v1TokenBalance,
            v2TokenBalance,
            this.onPasswordDialogOpenListener,
            this.onVETLearnMoreDialogOpenListener
        )
        ReactMaterialUiNotifications.clearNotifications()
        ReactMaterialUiNotifications.showNotification(notification)
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

    onVETTokenUpgradeDialogCloseListener = () =>
        this.toggleDialog(DIALOG_VET_TOKEN_UPGRADE, false)

    onTokenUpgradeErrorDialogCloseListener = () =>
        this.toggleDialog(DIALOG_ERROR, false)

    onPasswordEntryDialogCloseListener = () =>
        this.toggleDialog(DIALOG_PASSWORD_ENTRY, false)

    onSendListener = () => this.props.history.push('/send')

    onPasswordListener = password => {
        let dialogs = this.state.dialogs
        this.toggleDialog(DIALOG_PASSWORD_ENTRY, false)
        if (this.state.selectedTokenContract === '2') {
            dialogs.upgradeToVET.tokenUpgrade.key = keyHandler.get(password)
            this.toggleDialog(DIALOG_VET_TOKEN_UPGRADE, true)
        } else {
            dialogs.upgrade.tokenUpgrade.key = keyHandler.get(password)
            this.toggleDialog(DIALOG_TOKEN_UPGRADE, true)
        }
        this.setState({ dialogs: dialogs })

    }

    onVETUpgradeListener = async () => {
        let privateKey = this.state.dialogs.upgradeToVET.tokenUpgrade.key
        let V1TokenBalance = this.state.balances.oldToken.amount
        let V2TokenBalance = this.state.balances.newToken.amount

        // Upgrade V1 and V2 Token, needs testing !!!
        try {
            const upgradeV1ToVETReceipt = await helper
                .getContractHelper()
                .getWrappers()
                .vetDeposit()
                .depositTokenForV1(privateKey, V1TokenBalance)

            this.cachePendingTransaction(
                upgradeV1ToVETReceipt,
                helper.getWeb3().eth.defaultAccount,
                helper.formatDbets(V1TokenBalance)
            )
            const upgradeV2ToVETReceipt = await helper
                .getContractHelper()
                .getWrappers()
                .vetDeposit()
                .depositTokenForV2(privateKey, V2TokenBalance)

            this.cachePendingTransaction(
                upgradeV2ToVETReceipt,
                helper.getWeb3().eth.defaultAccount,
                helper.formatDbets(V2TokenBalance)
            )

            
            this.refresh()
        } catch (e) {
            log.error(`Wallet.jsx: onVETUpgradeListener: ${e.message}`)
            console.log(e)
            this.toggleDialog(DIALOG_ERROR, true)
        }

        this.toggleDialog(DIALOG_VET_TOKEN_UPGRADE, false)
    }

    onUpgradeListener = () => {
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

        helper
            .getContractHelper()
            .getWrappers()
            .oldToken()
            .upgrade(address, privateKey, oldTokenBalance, callback)
    }

    renderNotification = () => {
        return (
            <MuiThemeProvider muiTheme={themes.getNotification()}>
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
                onUpgrade={this.onVETUpgradeListener}
                onClose={this.onVETTokenUpgradeDialogCloseListener}
            />
        )
    }

    render() {
        let transactionsLoaded =
            !this.state.transactions.loading.from &&
            !this.state.transactions.loading.to
        return (
            <div className="wallet container">
                <WalletHeader
                    onRefreshListener={this.refresh}
                    address={this.state.address}
                />
                <WalletBalance
                    tokenBalance={this.getTokenBalance()}
                    onSendListener={this.onSendListener}
                />
                <PendingTransactionsList
                    pendingTransactionsList={this.state.transactions.pending}
                />
                <ConfirmedTransactionList
                    transactionList={this.state.transactions.confirmed}
                    transactionsLoaded={transactionsLoaded}
                    walletAddress={this.state.address}
                />
                {this.renderNotification()}
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
            </div>
        )
    }
}

export default injectIntl(Wallet)
