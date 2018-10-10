/* eslint-disable no-console */
import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { Snackbar, Typography, Grid } from '@material-ui/core'
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
import ErrorBoundary from '../Base/ErrorBoundary'
import BalanceListener from '../Base/BalanceListener'

let i18n
const messages = componentMessages('src.Components.Dashboard.Dashboard', [
    'ExportPrivateKey',
    'ExportPrivateKeyLabel',
    'ExportPrivateKeyMessage',
    'CopiedToClipboard'
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
    _balanceListener = null

    constructor(props) {
        super(props)
        this._balanceListener = new BalanceListener(
            window.web3Object,
            window.thor
        )

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

    componentWillUnmount = () => {
        this._balanceListener.stop()
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

    loadBalances = () => {
        this._balanceListener.onBalancesChange(
            ({ ethBalance, vthoBalance }) => {
                this.setState({
                    ethBalance: {
                        amount: helper.formatEther(ethBalance.toString()),
                        loading: false
                    },
                    vthoBalance: {
                        amount: helper.formatEther(vthoBalance.toString()),
                        loading: false
                    }
                })
            }
        )
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

    onLogoutListener = () => {
        this._balanceListener.stop()
        this.props.history.push('/login')
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
        this.toggleSnackbar(true, i18n('CopiedToClipboard'))
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

    onRefreshListener = () => {}
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
        return (
            <ConfirmationDialog
                onClick={this.onClosePrivateKeyDialogListener}
                onClose={this.onClosePrivateKeyDialogListener}
                title={i18n('ExportPrivateKey')}
                message={
                    <Grid container={true} direction="column" spacing={24}>
                        <Grid item={true} xs={12}>
                            <Typography variant="subheading">
                                {i18n('ExportPrivateKeyLabel')}
                            </Typography>
                            <Typography color="primary">
                                {this.state.dialogs.privateKey.key}
                            </Typography>
                        </Grid>
                        <Grid item={true} xs={12}>
                            <Typography
                                variant="body1"
                                style={{ textAlign: 'justify' }}
                            >
                                {i18n('ExportPrivateKeyMessage')}
                            </Typography>
                        </Grid>
                    </Grid>
                }
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
                <ErrorBoundary>
                    {this.renderAppBar()}
                    <div>
                        <DashboardRouter
                            ethBalance={this.state.ethBalance.amount}
                            vthoBalance={this.state.vthoBalance.amount}
                            selectedTokenContract={
                                this.state.selectedTokenContract
                            }
                        />
                    </div>
                    {this.renderSnackBar()}
                    {this.renderDrawer()}
                    {this.renderPasswordEntryDialog()}
                    {this.renderPrivateKeyDialog()}
                    <AboutDialog
                        isShown={this.state.isAboutDialogShown}
                        onCloseListener={this.onCloseAboutDialogListener}
                    />
                </ErrorBoundary>
            </div>
        )
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired
}
export default withStyles(styles)(injectIntl(Dashboard))
