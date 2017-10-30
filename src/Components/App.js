import React, {Component} from 'react'

import ConfirmationDialog from './Base/Dialogs/ConfirmationDialog'
import Helper from './Helper'

const helper = new Helper()

const DIALOG_UPDATE = 0

let ipcRenderer

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dialogs: {
                update: {
                    open: false
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
        ipcRenderer.on('updateReady', function (event, text) {
            console.log('Update ready', event, text)
            self.helpers().toggleDialog(DIALOG_UPDATE, true)
        })
    }

    helpers = () => {
        const self = this
        return {
            toggleDialog: (type, open) => {
                let dialogs = self.state.dialogs
                if (type == DIALOG_UPDATE)
                    dialogs.update.open = open
                self.setState({
                    dialogs: dialogs
                })
            },
            sendUpdateIpcMessage: () => {
                self.helpers().toggleDialog(DIALOG_UPDATE, false)
                if (helper.isElectron())
                    ipcRenderer.send('quitAndInstall')
            }
        }
    }

    dialogs = () => {
        const self = this
        return {
            update: () => {
                return <ConfirmationDialog
                    title="Update Available"
                    message="A new update was detected and has been downloaded. It will now be installed."
                    open={self.state.dialogs.update.open}
                    onClose={self.helpers().sendUpdateIpcMessage}
                    onClick={self.helpers().sendUpdateIpcMessage}
                />
            }
        }
    }

    render() {
        return <div>
            {this.props.children}
            {this.dialogs().update()}
        </div>
    }

}

export default App