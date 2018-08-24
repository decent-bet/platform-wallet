const CryptoJS = require('crypto-js')
const log = require('electron-log');

class KeyHandler {

    /**
     * Caches a wallet's private key
     */
    set = (key, address, password) => {
        const encryptedKey = CryptoJS.AES.encrypt(key, password).toString()
        localStorage.setItem('key', encryptedKey)
        localStorage.setItem('address', address)
    }

    /**
     * Returns private key of the logged in user
     */
    get = (password) => {
        let privateKey
        try {
            privateKey = CryptoJS.AES
                .decrypt(localStorage.getItem('key'), password)
                .toString(CryptoJS.enc.Utf8)
        } catch (e) {
            log.error(`KeyHandler.js: Error getting private key: ${e.message}`)
        }
        return privateKey
    }

    /**
     * Returns address of the logged in user
     */
    getAddress = () => {
        return localStorage.getItem('address')
    }


    /**
     * Clears the logged in keys
     */
    clear = () => {
        localStorage.clear()
    }

    isLoggedIn = () => {
        return (localStorage.getItem('key') != null)
    }

}

export default KeyHandler