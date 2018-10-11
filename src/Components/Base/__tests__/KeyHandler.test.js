let module
// const CryptoJS = require('crypto-js') //via mock file

describe('Components/Base/KeyHandler', function () {
    beforeEach(() => {
        module = require('../KeyHandler').default
    })
    it('should export KeyHandler', function () {
        expect(module).toBeTruthy()
    })
    it.skip('should call "CryptoJS.AES.encrypt" and set localStorage when "set" is called', function () {
        const key = "0xF00"
        const address = "0xF01"
        const password = "Password1"
        const keyHandler = new module()
        keyHandler.set({ privateKey: key, address, password })
        // expect(CryptoJS.AES.encrypt).toBeCalled()
    })

})