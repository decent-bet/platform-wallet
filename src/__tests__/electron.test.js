const mockElectron = {
    app: {
        makeSingleInstance: jest.fn(),
        on: jest.fn()
    },
    ipcMain: {
        on: jest.fn()
    }
}
const mockElectronUpdaterAppImageFix = {
    autoUpdater: { on: jest.fn() }
}

describe('electron', function() {
    let module
    beforeEach(() => {
        jest.mock('electron', () => mockElectron)
        jest.mock('electron-serve')
        jest.mock(
            'electron-updater-appimage-fix',
            () => mockElectronUpdaterAppImageFix
        )
        module = require('../electron')
    })

    it('should render without throwing an error', function() {
        expect(mockElectron.ipcMain.on).toHaveBeenCalled()
    })
})
