const {app, BrowserWindow, Menu, ipcMain} = require('electron')
const updater = require('electron-updater').autoUpdater
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

function createWindow() {
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
}

function initializeMenu() {
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
                    click: () => {
                        app.quit();
                    }
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

updater.on('update-downloaded', (ev, info) => {
    mainWindow.webContents.send('updateReady')
})

ipcMain.on("quitAndInstall", (event, arg) => {
    updater.quitAndInstall()
})