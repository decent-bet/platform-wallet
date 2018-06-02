import React, { Component, Fragment } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import LogoutRoute from './LogoutRoute'
import PrivateRoute from './PrivateRoute'

import ConfirmationDialog from '../Base/Dialogs/ConfirmationDialog'
import Helper from '../Helper'
import Login from '../Login'
import NewWallet from '../NewWallet'
import Dashboard from '../Dashboard'
import House from '../Dashboard/House'

const helper = new Helper()

const DIALOG_UPDATE_AVAILABLE = 0,
    DIALOG_UPDATE_INSTALLED = 1

let ipcRenderer

class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dialogs: {
                update: {
                    available: {
                        open: false
                    },
                    installed: {
                        open: false
                    }
                }
            }
        }
    }

    componentWillMount = () => {
        if (helper.isElectron()) this.initAutoUpdateListener()
    }

    initAutoUpdateListener = () => {
        ipcRenderer = window.require('electron').ipcRenderer
        ipcRenderer.on(
            'updateAvailable',
            this.onOpenUpdateAvailableDialogListener
        )
        ipcRenderer.on('updateReady', this.onOpenUpdateReadyDialogListener)
    }

    toggleDialog = (type, open) => {
        let dialogs = this.state.dialogs
        if (type === DIALOG_UPDATE_AVAILABLE) {
            dialogs.update.available.open = open
        } else if (type === DIALOG_UPDATE_INSTALLED) {
            dialogs.update.installed.open = open
        }
        this.setState({ dialogs: dialogs })
    }

    onQuitAndInstallListener = () => {
        this.toggleDialog(DIALOG_UPDATE_INSTALLED, false)
        if (helper.isElectron()) {
            ipcRenderer.send('quitAndInstall')
        }
    }

    onOpenUpdateAvailableDialogListener = () =>
        this.toggleDialog(DIALOG_UPDATE_AVAILABLE, true)
    onOpenUpdateReadyDialogListener = () =>
        this.toggleDialog(DIALOG_UPDATE_INSTALLED, true)
    onCloseUpdateAvailableDialogListener = () =>
        this.toggleDialog(DIALOG_UPDATE_AVAILABLE, false)

    renderUpdateAvailableDialog = () => {
        return (
            <ConfirmationDialog
                title="Update Notification"
                message="A new update was detected and will be downloaded in the background."
                open={this.state.dialogs.update.available.open}
                onClose={this.onCloseUpdateAvailableDialogListener}
                onClick={this.onCloseUpdateAvailableDialogListener}
            />
        )
    }
    renderUpdateInstalledDialog = () => {
        return (
            <ConfirmationDialog
                title="Update Notification"
                message="A new update was detected and has been downloaded. It will now be installed."
                open={this.state.dialogs.update.installed.open}
                onClose={this.onQuitAndInstallListener}
                onClick={this.onQuitAndInstallListener}
            />
        )
    }

    render() {
        return (
            <Fragment>
                <BrowserRouter>
                    <Switch>
                        <PrivateRoute exact path="/" component={Dashboard} />
                        <PrivateRoute path="/send" component={Dashboard} />
                        <PrivateRoute path="/wallet" component={Dashboard} />
                        <PrivateRoute path="/house" component={Dashboard} />
                        <LogoutRoute path="/login" component={Login} />
                        <Route path="/new_wallet" component={NewWallet} />
                    </Switch>
                </BrowserRouter>

                {this.renderUpdateAvailableDialog()}
                {this.renderUpdateInstalledDialog()}
            </Fragment>
        )
    }
}

export default App
