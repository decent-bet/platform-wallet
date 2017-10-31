import React, {Component} from 'react'

import ConfirmationDialog from './Base/Dialogs/ConfirmationDialog'
import Helper from './Helper'

const helper = new Helper()

const DIALOG_UPDATE_AVAILABLE = 0, DIALOG_UPDATE_INSTALLED = 1

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
        if (helper.isElectron())
            this.initAutoUpdateListener()
    }

    initAutoUpdateListener = () => {
        const self = this
        ipcRenderer = window.require('electron').ipcRenderer
        ipcRenderer.on('updateAvailable', function () {
            self.helpers().toggleDialog(DIALOG_UPDATE_AVAILABLE, true)
        })
        ipcRenderer.on('updateReady', function () {
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
                if (helper.isElectron())
                    ipcRenderer.send('quitAndInstall')
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
                return <ConfirmationDialog
                    title="Update Notification"
                    message="A new update was detected and will be downloaded in the background."
                    open={self.state.dialogs.update.available.open}
                    onClose={closeDialog}
                    onClick={closeDialog}
                />
            },
            updateInstalled: () => {
                return <ConfirmationDialog
                    title="Update Notification"
                    message="A new update was detected and has been downloaded. It will now be installed."
                    open={self.state.dialogs.update.installed.open}
                    onClose={self.helpers().quitAndInstall}
                    onClick={self.helpers().quitAndInstall}
                />
            }
        }
    }

    render() {
        return <div>
            {this.props.children}
            {this.dialogs().updateAvailable()}
            {this.dialogs().updateInstalled()}
        </div>
    }

}

export default App