const CryptoJS = require('crypto-js')

class KeyHandler {
    /**
     * Caches a wallet's private key
     */
    set = ({ privateKey, address, password, mnemonic }) => {
        const encryptedKey = CryptoJS.AES.encrypt(
            privateKey,
            password
        ).toString()
        localStorage.setItem('key', encryptedKey)
        localStorage.setItem('address', address)

        if (mnemonic) {
            const encryptedMnemonic = CryptoJS.AES.encrypt(
                mnemonic,
                password
            ).toString()
            localStorage.setItem('mnemonic', encryptedMnemonic)
        }
    }

    /**
     * Returns private key and mnemonic of the logged in user
     */
    get = password => {
        let privateKey
        let mnemonic
        try {
            privateKey = CryptoJS.AES.decrypt(
                localStorage.getItem('key'),
                password
            ).toString(CryptoJS.enc.Utf8)

            mnemonic = CryptoJS.AES.decrypt(
                localStorage.getItem('mnemonic'),
                password
            ).toString(CryptoJS.enc.Utf8)
        } catch (e) {
            // log.error(`KeyHandler.js: Error getting private key: ${e.message}`)
        }
        return { mnemonic, privateKey }
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
        return localStorage.getItem('key') != null
    }
}

export default KeyHandler
