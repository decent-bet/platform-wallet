import React, {Component} from 'react'

import { MuiThemeProvider, Snackbar} from 'material-ui'
import DashboardAppBar from './DashboardAppBar.jsx'
import DashboardDrawer from "./DashboardDrawer.jsx"

import ConfirmationDialog from '../Base/Dialogs/ConfirmationDialog'
import PasswordEntryDialog from '../Base/Dialogs/PasswordEntryDialog'
import Send from '../Wallet/Send'
import Wallet from '../Wallet/Wallet'

import Helper from '../Helper'
import KeyHandler from '../Base/KeyHandler'
import Themes from './../Base/Themes'

import './dashboard.css'

const keyHandler = new KeyHandler()
const themes = new Themes()
const helper = new Helper()

const constants = require('../Constants')
const styles = require('../Base/styles').styles

const VIEW_WALLET = 0
const VIEW_SEND = 1

const DIALOG_PASSWORD_ENTRY = 0, DIALOG_PRIVATE_KEY = 1

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
        if (!keyHandler.isLoggedIn())
            window.location = constants.PAGE_WALLET_LOGIN
    }

    componentWillMount = () => {
        this.web3Getters().ethBalance()
    }

    web3Getters = () => {
        const self = this
        return {
            ethBalance: () => {
                helper.getWeb3().eth.getBalance(self.state.address, (err, balance) => {
                    if (!err){

                        self.setState({
                            balance: {
                                amount: helper.formatEther(balance.toString()),
                                loading: false
                            }
                        })
                    }
                })
            }
        }
    }

    helpers = () => {
        const self = this
        return {
            toggleDrawer: (open) => {
                let drawer = self.state.drawer
                drawer.open = open
                self.setState({
                    drawer: drawer
                })
                self.helpers().toggleSnackbar(false)
            },
            toggleDialog: (type, open) => {
                let dialogs = self.state.dialogs
                if (type == DIALOG_PASSWORD_ENTRY)
                    dialogs.password.open = open
                else if (type == DIALOG_PRIVATE_KEY)
                    dialogs.privateKey.open = open
                self.setState({
                    dialogs: dialogs
                })
                self.helpers().toggleSnackbar(false)
            },
            getSelectedView: () => {
                switch (self.state.view) {
                    case VIEW_WALLET:
                        return <Wallet
                            selectedTokenContract={self.state.selectedTokenContract}
                            onRefresh={self.helpers().initEthBalance}
                        />
                    case VIEW_SEND:
                        return <Send
                            selectedTokenContract={self.state.selectedTokenContract}/>
                }
            },
            logout: () => {
                window.location = constants.PAGE_WALLET_LOGOUT
            },
            toggleSnackbar: (open, message) => {
                let snackbar = self.state.snackbar
                snackbar.open = open
                snackbar.message = message
                self.setState({
                    snackbar: snackbar
                })
            },
            selectTokenContract: (type) => {
                helper.setSelectedTokenContract(type)
                self.setState({
                    selectedTokenContract: type
                })
            }
        }
    }

    views = () => {
        const self = this
        return {
            selectedView: () => {
                return <div className="view">
                    {self.helpers().getSelectedView()}
                </div>
            },
            snackbar: () => {
                // Snackbar cannot have a null message.
                if (!self.state.snackbar.message){
                    return ''
                }
                return <MuiThemeProvider muiTheme={themes.getSnackbar()}>
                    <Snackbar
                        message={self.state.snackbar.message}
                        open={self.state.snackbar.open}
                        autoHideDuration={3000}
                    />
                </MuiThemeProvider>
            }
        }
    }

    dialogs = () => {
        const self = this
        return {
            passwordEntry: () => {
                return <PasswordEntryDialog
                    open={self.state.dialogs.password.open}
                    onValidPassword={(password) => {
                        let dialogs = self.state.dialogs
                        dialogs.privateKey.key = keyHandler.get(password)
                        self.setState({
                            dialogs: dialogs
                        })
                        self.helpers().toggleDialog(DIALOG_PASSWORD_ENTRY, false)
                        self.helpers().toggleDialog(DIALOG_PRIVATE_KEY, true)
                    }}
                    onClose={() => {
                        self.helpers().toggleDialog(DIALOG_PASSWORD_ENTRY, false)
                    }}
                />
            },
            privateKey: () => {
                return <ConfirmationDialog
                    title="Export Private Key"
                    message={"Your private key: " + self.state.dialogs.privateKey.key}
                    open={self.state.dialogs.privateKey.open}
                    onClick={() => {
                        self.helpers().toggleDialog(DIALOG_PRIVATE_KEY, false)
                    }}
                    onClose={() => {
                        self.helpers().toggleDialog(DIALOG_PRIVATE_KEY, false)
                    }}
                />
            }
        }
    }

    render() {
        let self = this
        return (
            <MuiThemeProvider muiTheme={themes.getAppBar()}>
                <div className="dashboard">
                    <DashboardAppBar
                        address={this.state.address}
                        balance={this.state.balance.amount}
                        isLoading={this.state.balance.loading}
                        onMenuToggle={() => {
                            self.helpers().toggleDrawer(!this.state.drawer.open)
                        }}
                        onLogout={this.helpers().logout}
                        onAddressCopyListener={() =>{
                            let text = 'Copied address to clipboard'
                            self.helpers().toggleSnackbar(true, text)
                        }}
                        />
                    { self.views().selectedView() }
                    { self.views().snackbar() }
                    <DashboardDrawer
                        isOpen={this.state.drawer.open}
                        onChangeContractTypeListener={this.helpers().selectTokenContract}
                        onExportPrivateKeyDialogListener={() => {
                            self.helpers().toggleDialog(DIALOG_PASSWORD_ENTRY, true)
                        }}
                        onAddressCopiedListener={() =>{
                            let text = 'Copied address to clipboard'
                            self.helpers().toggleSnackbar(true, text)
                        }}
                        onToggleDrawerListener={this.helpers().toggleDrawer}
                        selectedContractType={this.state.selectedTokenContract}
                        walletAddress={this.state.address}
                        />
                    { self.dialogs().passwordEntry() }
                    { self.dialogs().privateKey() }
                </div>
            </MuiThemeProvider>)
    }

}

export default Dashboard