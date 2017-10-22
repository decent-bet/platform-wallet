class KeyHandler {

    /**
     * Caches a wallet's private key
     */
    set = (key) => {
        localStorage.setItem('key', key)
    }

    /**
     * Returns the private key of the logged in user
     */
    get = () => {
        return localStorage.getItem('key')
    }

    /**
     * Clears the logged in keys
     */
    clear = () => {
        localStorage.clear()
    }

    /**
     * Saves the network provider of the last network used
     * @param provider
     */
    saveNetworkProvider = (provider) => {
        localStorage.setItem('networkProvider', provider)
    }

    /**
     * Loads the network provider of the last network used
     * @returns {*}
     */
    loadNetworkProvider = () => {
        return localStorage.getItem('networkProvider')
    }

    isLoggedIn = () => {
        return (this.get() != null)
    }

}

export default KeyHandler