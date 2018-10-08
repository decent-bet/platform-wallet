/* eslint-disable no-console */
import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { Snackbar } from '@material-ui/core'
import { injectIntl } from 'react-intl'
import { componentMessages, getI18nFn } from '../../i18n/componentMessages'
import AboutDialog from './Dialogs/AboutDialog.jsx'
import DashboardAppBar from './DashboardAppBar.jsx'
import DashboardDrawer from './DashboardDrawer.jsx'
import DashboardRouter from './DashboardRouter'
import ConfirmationDialog from '../Base/Dialogs/ConfirmationDialog'
import PasswordEntryDialog from '../Base/Dialogs/PasswordEntryDialog'
import Helper from '../Helper'
import KeyHandler from '../Base/KeyHandler'
import ErrorBoundary from '../Base/ErrorBoundary';

let i18n
const messages = componentMessages('src.Components.Dashboard.Dashboard', [
    'ExportPrivateKey'
])
const keyHandler = new KeyHandler()
const helper = new Helper()
const constants = require('../Constants')
const DIALOG_PASSWORD_ENTRY = 0
const DIALOG_PRIVATE_KEY = 1

const styles = () => ({
    wrapper: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center'
    }
})
let transactionSubs = null
class Dashboard extends Component {
    constructor(props) {
        super(props)
        i18n = getI18nFn(props.intl, messages)
        this.state = {
            view: props.view,
            address: helper.getWeb3().eth.defaultAccount,
            ethNetwork: 0,
            ethBalance: {
                loading: true,
                amount: 0
            },
            vthoBalance: {
                loading: true,
                amount: 0
            },
            selectedTokenContract: helper.getSelectedTokenContract(),
            drawer: {
                open: false
            },
            snackbar: {
                open: false,
                message: null
            },
            dialogs: {
                privateKey: {
                    open: false,
                    key: null
                },
                password: {
                    open: false
                }
            },
            isAboutDialogShown: false
        }
    }

    componentDidMount = () => {
        this.loadBalances()
        this.setPubAddress()
    }

    setPubAddress(type) {
        const selectedToken = type || this.state.selectedTokenContract

        if (selectedToken === '2') {
            const vetPubAddress = keyHandler.getPubAddress()
            this.setState({
                address: vetPubAddress
            })
        } else {
            this.setState({
                address: helper.getWeb3().eth.defaultAccount
            })
        }
    }
    loadBalances() {
        this.initVTHOBalance()
        this.initEthBalance()

        // PENDING: Needs more testing
        // // listen for transfers
        // const contracts = helper.getContractHelper()
        // const txv1 = contracts.V1Token.getAllEvents$()
        // const txv2 = contracts.V2Token.getAllEvents$()

        // const txs = txv1.pipe(concat(txv2))

        // transactionSubs = txs.subscribe(t => {
        //     console.log('from transfer evt')
        //     if (t.event === 'Transfer') {
        //         // update balance
        //         this.initVTHOBalance()
        //         this.initEthBalance()
        //     }
        // })
    }

    initVTHOBalance = async () => {
        try {
            // VET balance
            const balance = await window.thor.eth.getEnergy(
                window.thor.eth.defaultAccount
            )
            this.setState({
                vthoBalance: {
                    amount: helper.formatEther(balance.toString()),
                    loading: false
                }
            })
            return
        } catch (e) {
            console.log(e)
        }
    }

    initEthBalance = () => {
        // if (!this.state.address) return

        helper.getWeb3().eth.getBalance(this.state.address, (err, balance) => {
            if (err) {
                return
            }
            this.setState({
                ethBalance: {
                    amount: helper.formatEther(balance.toString()),
                    loading: false
                }
            })
        })
    }

    toggleDrawer = open => {
        let drawer = this.state.drawer
        drawer.open = open
        this.setState({
            drawer: drawer
        })
        this.toggleSnackbar(false)
    }

    toggleDialog = (type, open) => {
        let dialogs = this.state.dialogs
        if (type === DIALOG_PASSWORD_ENTRY) dialogs.password.open = open
        else if (type === DIALOG_PRIVATE_KEY) dialogs.privateKey.open = open
        if (dialogs === this.state.dialogs) {
            this.setState({
                dialogs: dialogs
            })
            this.toggleSnackbar(false)
        }
    }

    onLogoutListener = () => this.props.history.push('/login')

    toggleSnackbar = (open, message) => {
        let snackbar = this.state.snackbar
        snackbar.open = open
        snackbar.message = message
        this.setState({
            snackbar: snackbar
        })
    }

    selectTokenContract = type => {
        this.onMenuToggle()
        helper.setSelectedTokenContract(type)
        this.setState({
            selectedTokenContract: type
        })

        setTimeout(() => {
            this.setPubAddress(type)
        }, 600)
    }

    // Shows a Snackbar after copying the public address on the clipboard
    onAddressCopiedListener = () => {
        let text = 'Copied address to clipboard'
        this.toggleSnackbar(true, text)
    }

    // Closes the Password Entry Dialog
    onClosePasswordEntryListener = () =>
        this.toggleDialog(DIALOG_PASSWORD_ENTRY, false)

    // Closes the Private Key Dialog
    onClosePrivateKeyDialogListener = () =>
        this.toggleDialog(DIALOG_PRIVATE_KEY, false)

    // Toggles the menu state
    onMenuToggle = () => this.toggleDrawer(!this.state.drawer.open)

    // Opens the Password Entry Dialog
    onOpenPasswordEntryListener = () => {
        this.onMenuToggle()
        this.toggleDialog(DIALOG_PASSWORD_ENTRY, true)
    }

    // Listener for the PasswordEntryDialog.
    // It will open the PrivateDialogKey if the password is correct
    onValidatePasswordAndShowPrivateKey = password => {
        let dialogs = this.state.dialogs
        dialogs.privateKey.key = helper.isVETContractSelected()
            ? keyHandler.get(password).vetPrivateKey
            : keyHandler.get(password).privateKey
        this.setState({
            dialogs: dialogs
        })
        this.toggleDialog(DIALOG_PASSWORD_ENTRY, false)
        this.toggleDialog(DIALOG_PRIVATE_KEY, true)
    }

    onShowAboutDialogListener = () => {
        this.onMenuToggle()
        this.setState({ isAboutDialogShown: true })
    }

    // Closes the About Dialog
    onCloseAboutDialogListener = () => {
        this.setState({ isAboutDialogShown: false })
    }

    renderPasswordEntryDialog = () => {
        return (
            <PasswordEntryDialog
                open={this.state.dialogs.password.open}
                onValidPassword={this.onValidatePasswordAndShowPrivateKey}
                onClose={this.onClosePasswordEntryListener}
            />
        )
    }

    renderPrivateKeyDialog = () => {
        let message = `Your private key: ${this.state.dialogs.privateKey.key}`
        return (
            <ConfirmationDialog
                onClick={this.onClosePrivateKeyDialogListener}
                onClose={this.onClosePrivateKeyDialogListener}
                title={i18n('ExportPrivateKey')}
                message={message}
                open={this.state.dialogs.privateKey.open}
            />
        )
    }

    renderSnackBar = () => {
        // Snackbar cannot have a null message.
        if (!this.state.snackbar.message) {
            return <span />
        }
        return (
            <Snackbar
                onClose={() => this.toggleSnackbar(false)}
                message={this.state.snackbar.message}
                open={this.state.snackbar.open}
                autoHideDuration={3000}
            />
        )
    }

    renderAppBar = () => {
        return (
            <DashboardAppBar
                selectedTokenContract={this.state.selectedTokenContract}
                address={this.state.address}
                currency={this.state.currency}
                ethBalance={this.state.ethBalance.amount}
                vthoBalance={this.state.vthoBalance.amount}
                isLoading={
                    this.state.ethBalance.loading &&
                    this.state.vthoBalance.loading
                }
                onMenuToggle={this.onMenuToggle}
                onAddressCopyListener={this.onAddressCopiedListener}
            />
        )
    }

    renderDrawer = () => {
        return (
            <DashboardDrawer
                isOpen={this.state.drawer.open}
                onChangeContractTypeListener={this.selectTokenContract}
                onExportPrivateKeyDialogListener={
                    this.onOpenPasswordEntryListener
                }
                onAddressCopiedListener={this.onAddressCopiedListener}
                onLogoutListener={this.onLogoutListener}
                onToggleDrawerListener={this.toggleDrawer}
                selectedContractType={this.state.selectedTokenContract}
                walletAddress={this.state.address}
                renderTokenVersionListItem={this.renderTokenVersionListItem}
                onShowAboutDialogListener={this.onShowAboutDialogListener}
            />
        )
    }

    render() {
        return (
            <div className={this.props.classes.wrapper}>
                {this.renderAppBar()}
                <div>
                    <ErrorBoundary>
                    <DashboardRouter
                        selectedTokenContract={this.state.selectedTokenContract}
                    />
                    </ErrorBoundary>
                </div>
                {this.renderSnackBar()}
                {this.renderDrawer()}
                {this.renderPasswordEntryDialog()}
                {this.renderPrivateKeyDialog()}
                <AboutDialog
                    isShown={this.state.isAboutDialogShown}
                    onCloseListener={this.onCloseAboutDialogListener}
                />
            </div>
        )
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired
}
export default withStyles(styles)(injectIntl(Dashboard))
