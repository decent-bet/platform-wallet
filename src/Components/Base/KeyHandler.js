/**
 * Created by user on 9/11/2017.
 */

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

    isLoggedIn = () => {
        return (this.get() != null)
    }

}

export default KeyHandler