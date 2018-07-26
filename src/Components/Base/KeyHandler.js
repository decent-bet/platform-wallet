const CryptoJS = require('crypto-js')

class KeyHandler {

    /**
     * Caches a wallet's private key
     */
    set = (currency, key, address, password) => {
        //TODO: add parameter validation
        const encryptedKey = CryptoJS.AES.encrypt(key, password).toString()
        localStorage.setItem('currency', currency)
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

        }
        return privateKey
    }

    /**
     * Returns address of the logged in user
     */
    getAddress = () => {
        return localStorage.getItem('address')
    }

    getCurrency = () => {
        return localStorage.getItem('currency')
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