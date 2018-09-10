const CryptoJS = require('crypto-js')

class KeyHandler {
    /**
     * Caches a wallet's private key
     */
    set = ({ vetPubAddress, privateKey, address, password, mnemonic }) => {
        const encryptedKey = CryptoJS.AES.encrypt(
            privateKey,
            password
        ).toString()
        localStorage.setItem('vetPubAddress', vetPubAddress)
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

    getPubAddress() {
        let vetPubAddress
        try {
            vetPubAddress = localStorage.getItem('vetPubAddress')
        } catch (e) {
            // log.error(`KeyHandler.js: Error getting private key: ${e.message}`)
        }
        return vetPubAddress
    }
    /**
     * Returns private key and mnemonic of the logged in user
     */
    get = password => {
        let privateKey
        let mnemonic
        let vetPubAddress
        try {
            vetPubAddress = localStorage.getItem('vetPubAddress')
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
        return { mnemonic, privateKey, vetPubAddress }
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
