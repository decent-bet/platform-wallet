const PENDING_TX_KEY = 'pendingTxs'

class PendingTxHandler {

    cacheTx = (hash, to, value) => {
        let pendingTxs = this.getTxs()
        pendingTxs.push({
            hash: hash,
            to: to,
            value: value
        })
        this._saveTxs(pendingTxs)
    }

    removeTx = (hash) => {
        let pendingTxs = this.getTxs()
        if (pendingTxs.indexOf(hash) > -1)
            pendingTxs.splice(pendingTxs.indexOf(hash), 1)
        this._saveTxs(pendingTxs)
    }

    getTxs = () => {
        return localStorage.getItem(PENDING_TX_KEY) != null ?
            JSON.parse(localStorage.getItem(PENDING_TX_KEY)) : []
    }

    _saveTxs = (txs) => {
        localStorage.setItem(PENDING_TX_KEY, JSON.stringify(txs))
    }

}

export default PendingTxHandler