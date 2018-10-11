const {
    app,
    BrowserWindow,
    Menu,
    ipcMain,
    globalShortcut
} = require('electron')
const path = require('path')
const server = require('electron-serve')
const { autoUpdater } = require('electron-updater')
const version = require('../package.json').version
const log = require('./logger')
const _logger = require("electron-log")
if (process.env.NODE_ENV === 'development') {
    require('electron-debug')({enabled: true})
}

let mainWindow
let loadUrl = server({ directory: 'build' })
_logger.transports.file.level = 'debug'
autoUpdater.logger = _logger

process.on('uncaughtException', (err) => {
    log.error(err)
    _logger.error(err)
})

process.on('unhandledRejection', (reason, promise) => {
    log.error(reason)
    _logger.error(reason)
})

const enforceSingleAppInstance = () => {
    const isSecondInstance = app.makeSingleInstance(
        () => {
            // Someone tried to run a second instance, we should focus our window.
            if (mainWindow) {
                if (mainWindow.isMinimized()) mainWindow.restore()
                mainWindow.focus()
            }
        }
    )

    if (isSecondInstance) {
        app.quit()
    }
}

enforceSingleAppInstance()

const initializeMenu = () => {
    let menuTemplate = [
        {
            label: 'Menu',
            submenu: [
                {
                    label: 'v' + version,
                    click: () => {}
                },
                {
                    label: 'Exit',
                    accelerator: 'CommandOrControl+Q',
                    click: () => {
                        app.quit()
                    }
                }
            ]
        },
        {
            label: 'Edit',
            submenu: [
                {
                    label: 'Cut',
                    accelerator: 'Cmd+X',
                    selector: 'cut:'
                },
                {
                    label: 'Copy',
                    accelerator: 'Cmd+C',
                    selector: 'copy:'
                },
                {
                    label: 'Paste',
                    accelerator: 'Cmd+V',
                    selector: 'paste:'
                },
                {
                    label: 'Select All',
                    accelerator: 'Cmd+A',
                    selector: 'selectAll:'
                }
            ]
        }
    ]

    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)
}

const createWindow = () => {
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        show: false,
        icon: path.join(__dirname, 'public/icons/icon-512x512.png'),
        backgroundColor: '#2a324e'
    })

    initializeMenu()
    // Load the main page
    loadUrl(mainWindow)

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.on('closed', function() {
        mainWindow = null
    })
    // Add the minimize shortcut for OSX
    if (process.platform === 'darwin') {
        globalShortcut.register('CommandOrControl+M', () =>
            mainWindow.minimize()
        )
    }
}

app.on('ready', () => {
    app.commandLine.appendSwitch('ignore-certificate-errors')
    createWindow()
    mainWindow.webContents.on('did-finish-load', () => {
        autoUpdater.checkForUpdatesAndNotify()
    })
})

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    if (mainWindow === null) createWindow()
})

autoUpdater.on('update-available', (info) => {
    mainWindow.webContents.send('updateAvailable', info)
})

autoUpdater.on('update-downloaded', (info) => {
    mainWindow.webContents.send('updateReady', info)
})

ipcMain.on('quitAndInstall', () => {
    autoUpdater.quitAndInstall()
})
