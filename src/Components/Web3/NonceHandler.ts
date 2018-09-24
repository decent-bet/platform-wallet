export class NonceHandler {
    /**
     * Caches the last nonce
     */
    public set = nonce => {
        localStorage.setItem('nonce', nonce)
    }

    /**
     * Returns the next nonce based on the last nonce returned by getTransactionCount()
     */
    public get = txCount => {
        let cachedNonce = localStorage.getItem('nonce')
        if (!cachedNonce) { 
            return txCount
        }
        else {
            const nonce = parseInt(cachedNonce, 10)
            if (txCount > nonce) {
                 return txCount
            }
            // Last successful nonce
            else {
                return nonce + 1
            }
        }
    }

    /**
     * Clears the cached nonce
     */
    public clear = () => {
        localStorage.removeItem('nonce')
    }
}
