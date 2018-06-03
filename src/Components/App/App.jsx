import React, {Component, Fragment} from 'react'
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import {CircularProgress, MuiThemeProvider} from 'material-ui'
import LogoutRoute from './LogoutRoute'
import PrivateRoute from './PrivateRoute'

import ConfirmationDialog from '../Base/Dialogs/ConfirmationDialog'
import Themes from '../Base/Themes'
import Helper from '../Helper'
import Login from '../Login'
import NewWallet from '../NewWallet'
import Dashboard from '../Dashboard'
import {Provider} from 'react-redux'
import store from '../../Model/store'
import EventBus from 'eventing-bus'

const helper = new Helper()
const themes = new Themes()

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
            },
            stateMachine: 'loading'
        }
    }

    componentWillMount = () => {
        if (helper.isElectron()) this.initAutoUpdateListener()
    }

    componentDidMount = () => {
        if (window.web3Loaded) {
            this.setState({stateMachine: 'loaded'})
        } else {
            let web3Loaded = EventBus.on('web3Loaded', () => {
                this.setState({stateMachine: 'loaded'})
                // Unregister callback
                web3Loaded()
            })

            // Listen for error state
            let web3NotLoaded = EventBus.on('web3NotLoaded', () => {
                this.setState({stateMachine: 'error'})
                web3NotLoaded()
            })
        }
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
        this.setState({dialogs: dialogs})
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

    renderStateLoading = () => {
        return <CircularProgress/>
    }

    renderStateLoaded = () => {
        return <BrowserRouter>
            <Switch>
                <PrivateRoute exact path="/" component={Dashboard}/>
                <PrivateRoute path="/send" component={Dashboard}/>
                <PrivateRoute path="/wallet" component={Dashboard}/>
                <PrivateRoute path="/house" component={Dashboard}/>
                <LogoutRoute path="/login" component={Login}/>
                <Route path="/new_wallet" component={NewWallet}/>
            </Switch>
        </BrowserRouter>
    }

    renderStateError = () => {
        return <ConfirmationDialog
            open={true}
            title="Not connected to Web3 Provider"
            message={
                "Looks like you aren't connected to a local node. " +
                'Please setup a local node with an open RPC port @ 8545 and try again.'
            }
        />
    }

    renderInner = () => {
        switch (this.state.stateMachine) {
            case 'loaded':
                return this.renderStateLoaded()

            case 'loading':
                return this.renderStateLoading()

            case 'error':
                return this.renderStateError()

            default:
                return null
        }
    }

    render() {
        return (
            <Provider store={store}>
                <MuiThemeProvider muiTheme={themes.getMainTheme()}>
                    <Fragment>
                        {this.renderInner()}
                        {this.renderUpdateAvailableDialog()}
                        {this.renderUpdateInstalledDialog()}
                    </Fragment>
                </MuiThemeProvider>
            </Provider>
        )
    }
}

export default App
