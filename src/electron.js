const {
    app,
    dialog,
    BrowserWindow,
    Menu,
    ipcMain,
    globalShortcut
} = require('electron')

// if (process.env.NODE_ENV !== 'production') {
//    require('electron-debug')();
// }

const server = require('electron-serve')
const updater = require('electron-updater-appimage-fix').autoUpdater
const version = require('../package.json').version
const log = require('electron-log');
const path = require('path')
const url = require('url')

let mainWindow

process.on('uncaughtException', log.error);

// Loads the static files
const loadUrl = server({ directory: 'build_webpack' })

const enforceSingleAppInstance = () => {
    const isSecondInstance = app.makeSingleInstance(
        (commandLine, workingDirectory) => {
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

const createWindow = () => {
    const icon = __dirname + '/../public/assets/icons/favicon-32x32.png'
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        icon: icon,
        backgroundColor: '#12151a'
    })

    mainWindow.once('ready-to-show', () => {
        mainWindow.show()
    })

    // Load the main page
    loadUrl(mainWindow)

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
}

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

app.on('ready', () => {
    app.commandLine.appendSwitch("ignore-certificate-errors");

    createWindow()
    updater.checkForUpdates()
})

app.on('window-all-closed', function() {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function() {
    if (mainWindow === null) createWindow()
})

updater.on('update-available', (ev, info) => {
    mainWindow.webContents.send('updateAvailable')
})

updater.on('update-downloaded', (ev, info) => {
    mainWindow.webContents.send('updateReady')
})

ipcMain.on('quitAndInstall', (event, arg) => {
    updater.quitAndInstall()
})
