import React, { Component } from 'react'

import { MuiThemeProvider, Snackbar } from 'material-ui'
import DashboardAppBar from './DashboardAppBar.jsx'
import DashboardDrawer from './DashboardDrawer.jsx'

import ConfirmationDialog from '../Base/Dialogs/ConfirmationDialog'
import PasswordEntryDialog from '../Base/Dialogs/PasswordEntryDialog'
import Send from '../Send'
import Wallet from '../Wallet'

import Helper from '../Helper'
import KeyHandler from '../Base/KeyHandler'
import Themes from './../Base/Themes'

import './dashboard.css'

const keyHandler = new KeyHandler()
const themes = new Themes()
const helper = new Helper()

const constants = require('../Constants')

const VIEW_WALLET = 0
const VIEW_SEND = 1

const DIALOG_PASSWORD_ENTRY = 0
const DIALOG_PRIVATE_KEY = 1

class Dashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            view: props.view,
            address: helper.getWeb3().eth.defaultAccount,
            ethNetwork: 0,
            balance: {
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
            }
        }
        if (!keyHandler.isLoggedIn()) {
            window.location = constants.PAGE_WALLET_LOGIN
        }
    }

    componentWillMount = () => {
        this.initEthBalance()
    }

    initEthBalance = () => {
        helper.getWeb3().eth.getBalance(this.state.address, (err, balance) => {
            if (err) {
                return
            }
            this.setState({
                balance: {
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
        this.setState({
            dialogs: dialogs
        })
        this.toggleSnackbar(false)
    }

    logout = () => {
        window.location = constants.PAGE_WALLET_LOGOUT
    }

    toggleSnackbar = (open, message) => {
        let snackbar = this.state.snackbar
        snackbar.open = open
        snackbar.message = message
        this.setState({
            snackbar: snackbar
        })
    }

    selectTokenContract = type => {
        helper.setSelectedTokenContract(type)
        this.setState({
            selectedTokenContract: type
        })
    }

    // Shows a Snackbar after copying the public addres on the clipboard
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
    onOpenPasswordEntryListener = () =>
        this.toggleDialog(DIALOG_PASSWORD_ENTRY, true)

    // Listener for the PasswordEntryDialog.
    // It will open the PrivateDialogKey if the password is correct
    onValidatePasswordAndShowPrivateKey = password => {
        let dialogs = this.state.dialogs
        dialogs.privateKey.key = keyHandler.get(password)
        this.setState({
            dialogs: dialogs
        })
        this.toggleDialog(DIALOG_PASSWORD_ENTRY, false)
        this.toggleDialog(DIALOG_PRIVATE_KEY, true)
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
                title="Export Private Key"
                message={message}
                open={this.state.dialogs.privateKey.open}
                onClick={this.onClosePrivateKeyDialogListener}
                onClose={this.onClosePrivateKeyDialogListener}
            />
        )
    }

    renderSelectedView = () => {
        let contract = this.state.selectedTokenContract
        switch (this.state.view) {
            case VIEW_WALLET:
                return (
                    <Wallet
                        selectedTokenContract={contract}
                        onRefresh={this.initEthBalance}
                    />
                )
            case VIEW_SEND:
                return <Send selectedTokenContract={contract} />
            default:
                // This Shouldn't happen
                return <span />
        }
    }

    renderSnackBar = () => {
        // Snackbar cannot have a null message.
        if (!this.state.snackbar.message) {
            return <span />
        }
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

    renderAppBar = () => {
        return (
            <DashboardAppBar
                address={this.state.address}
                balance={this.state.balance.amount}
                isLoading={this.state.balance.loading}
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
                onLogoutListener={this.logout}
                onToggleDrawerListener={this.toggleDrawer}
                selectedContractType={this.state.selectedTokenContract}
                walletAddress={this.state.address}
            />
        )
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={themes.getAppBar()}>
                <div className="dashboard">
                    {this.renderAppBar()}
                    <div className="view">{this.renderSelectedView()}</div>
                    {this.renderSnackBar()}
                    {this.renderDrawer()}
                    {this.renderPasswordEntryDialog()}
                    {this.renderPrivateKeyDialog()}
                </div>
            </MuiThemeProvider>
        )
    }
}

export default Dashboard