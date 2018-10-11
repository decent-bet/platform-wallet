const CryptoJS = require('crypto-js')

class KeyHandler {
    /**
     * Caches a wallet's private key
     */
    set = ({ vetPubAddress, vetPrivateKey, privateKey, address, password, mnemonic }) => {
        const encryptedPrivateKey = CryptoJS.AES.encrypt(
            privateKey,
            password
        ).toString()
        const encryptedVetPrivateKey = CryptoJS.AES.encrypt(
            vetPrivateKey,
            password
        ).toString()
        localStorage.setItem('vetPrivateKey', encryptedVetPrivateKey)
        localStorage.setItem('vetPubAddress', vetPubAddress)
        localStorage.setItem('privateKey', encryptedPrivateKey)
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
        let vetPubAddress
        let vetPrivateKey
        let address
        let privateKey
        let mnemonic
        try {
            vetPrivateKey = CryptoJS.AES.decrypt(
                localStorage.getItem('vetPrivateKey'),
                password
            ).toString(CryptoJS.enc.Utf8)
            vetPubAddress = localStorage.getItem('vetPubAddress')
            privateKey = CryptoJS.AES.decrypt(
                localStorage.getItem('privateKey'),
                password
            ).toString(CryptoJS.enc.Utf8)
            address = localStorage.getItem('address')
            mnemonic = CryptoJS.AES.decrypt(
                localStorage.getItem('mnemonic'),
                password
            ).toString(CryptoJS.enc.Utf8)
        } catch (e) {
            console.error(`KeyHandler.js: Error getting private key: ${e.message}`)
        }
        return { mnemonic, privateKey, address, vetPrivateKey, vetPubAddress }
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
        return localStorage.getItem('privateKey') != null
    }
}

export default KeyHandler
