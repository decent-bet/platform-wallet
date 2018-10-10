const {
    app,
    BrowserWindow,
    Menu,
    ipcMain,
    globalShortcut
} = require('electron')
const server = require('electron-serve')
const { autoUpdater } = require('electron-updater')
const version = require('../package.json').version
const log = require('./logger')
if (process.env.NODE_ENV === 'development') {
    require('electron-debug')()
}


let mainWindow
let loadUrl = server({ directory: 'build' })
process.on('uncaughtException', log.error)
process.on('unhandledRejection', (reason, promise) => {
    log.error(reason)
  });
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
    const menuTemplate = [
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
    const icon = __dirname + '/../public/assets/icons/favicon-32x32.png'
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        icon,
        backgroundColor: '#2a324e'
    })

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    mainWindow.on('closed', function() {
        mainWindow = null
    })

    initializeMenu()
    // Add the minimize shortcut for OSX
    if (process.platform === 'darwin') {
        globalShortcut.register('CommandOrControl+M', () =>
            mainWindow.minimize()
        )
    }

    // Load the main page
    loadUrl(mainWindow)
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
