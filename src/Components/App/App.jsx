import React, { Component, Fragment } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import LogoutRoute from './LogoutRoute'
import PrivateRoute from './PrivateRoute'

import ConfirmationDialog from '../Base/Dialogs/ConfirmationDialog'
import Helper from '../Helper'
import Login from '../Login'
import NewWallet from '../NewWallet'
import Dashboard from '../Dashboard'

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
        const self = this
        ipcRenderer = window.require('electron').ipcRenderer
        ipcRenderer.on('updateAvailable', function() {
            self.helpers().toggleDialog(DIALOG_UPDATE_AVAILABLE, true)
        })
        ipcRenderer.on('updateReady', function() {
            self.helpers().toggleDialog(DIALOG_UPDATE_INSTALLED, true)
        })
    }

    helpers = () => {
        const self = this
        return {
            toggleDialog: (type, open) => {
                let dialogs = self.state.dialogs
                if (type == DIALOG_UPDATE_AVAILABLE)
                    dialogs.update.available.open = open
                else if (type == DIALOG_UPDATE_INSTALLED)
                    dialogs.update.installed.open = open
                self.setState({
                    dialogs: dialogs
                })
            },
            quitAndInstall: () => {
                self.helpers().toggleDialog(DIALOG_UPDATE_INSTALLED, false)
                if (helper.isElectron()) ipcRenderer.send('quitAndInstall')
            }
        }
    }

    dialogs = () => {
        const self = this
        return {
            updateAvailable: () => {
                const closeDialog = () => {
                    self.helpers().toggleDialog(DIALOG_UPDATE_AVAILABLE, false)
                }
                return (
                    <ConfirmationDialog
                        title="Update Notification"
                        message="A new update was detected and will be downloaded in the background."
                        open={self.state.dialogs.update.available.open}
                        onClose={closeDialog}
                        onClick={closeDialog}
                    />
                )
            },
            updateInstalled: () => {
                return (
                    <ConfirmationDialog
                        title="Update Notification"
                        message="A new update was detected and has been downloaded. It will now be installed."
                        open={self.state.dialogs.update.installed.open}
                        onClose={self.helpers().quitAndInstall}
                        onClick={self.helpers().quitAndInstall}
                    />
                )
            }
        }
    }

    render() {
        return (
            <Fragment>
                <BrowserRouter>
                    <Switch>
                        <PrivateRoute exact path="/" component={Dashboard} />
                        <PrivateRoute path="/send" component={Dashboard} />
                        <LogoutRoute path="/login" component={Login} />
                        <Route path="/new_wallet" component={NewWallet} />
                    </Switch>
                </BrowserRouter>

                {this.dialogs().updateAvailable()}
                {this.dialogs().updateInstalled()}
            </Fragment>
        )
    }
}

export default App
