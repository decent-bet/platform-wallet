const {app, dialog, BrowserWindow, Menu, ipcMain, globalShortcut } = require('electron')
const updater = require('electron-updater-appimage-fix').autoUpdater
const version = require('../package.json').version

const path = require('path')
const url = require('url')

let mainWindow

const express = require('express')
const webApp = express()

webApp.use(express.static(path.join(__dirname, '../build_webpack')))

webApp.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, '../build_webpack', 'index.html'))
})

const listener = webApp.listen(0)

const enforceSingleAppInstance = () => {
    const isSecondInstance = app.makeSingleInstance((commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (mainWindow) {
            if (mainWindow.isMinimized()) mainWindow.restore()
            mainWindow.focus()
        }
    })

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

    mainWindow.loadURL('http://localhost:' + listener.address().port)

    console.log('DBET Wallet running on port ', listener.address().port)

    mainWindow.on('closed', function () {
        mainWindow = null
    })

    initializeMenu()

    // Add the minimize shortcut for OSX
    if (process.platform === 'darwin') {
        globalShortcut.register('CommandOrControl+M', mainWindow.minimize)
    }
}

const initializeMenu = () => {
    const menuTemplate = [
        {
            label: 'Menu',
            submenu: [
                {
                    label: 'v' + version,
                    click: () => {
                    }
                }, {
                    label: 'Exit',
                    accelerator: 'CommandOrControl+Q',
                    click: () => {
                        app.quit();
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
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu)
}

app.on('ready', () => {
    createWindow()
    updater.checkForUpdates()
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    if (mainWindow === null)
        createWindow()
})

updater.on('update-available', (ev, info) => {
    mainWindow.webContents.send('updateAvailable')
})

updater.on('update-downloaded', (ev, info) => {
    mainWindow.webContents.send('updateReady')
})

ipcMain.on("quitAndInstall", (event, arg) => {
    updater.quitAndInstall()
})