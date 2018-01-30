import React from 'react'
import PendingTransactionListItem from './PendingTransactionListItem.jsx'

// Parse the pending transactions into a list
function parsePendingTransactions(pendingTransactions) {
    let txs = []
    if (pendingTransactions) {
        for (const hash in pendingTransactions) {
            if (pendingTransactions.hasOwnProperty(hash)) {
                txs.push(pendingTransactions[hash])
            }
        }
    }
    return txs
}

// Widget Itself
export default function PendingTransactionList({
    pendingTransactionsList,
    pendingTransactionsAvailable
}) {
    if (!pendingTransactionsAvailable) {
        // Empty List
        return <span />
    } else {
        let pendingTransactions = parsePendingTransactions(
            pendingTransactionsList
        )
        return (
            <div className="col-10 offset-1 offset-md-0 col-md-12 transactions px-0 mt-4">
                <h3>PENDING</h3>
                {pendingTransactions.map(tx => (
                    <PendingTransactionListItem
                        transaction={tx}
                        key={tx.hash}
                    />
                ))}
            </div>
        )
    }
}
