import React from 'react'

import ConfirmedTransactionListItem from './ConfirmedTransactionListItem.jsx'

// Parse the confirmed transactions
function getSortedTransactions(confirmedTransactions) {
    let txs = []
    if (confirmedTransactions) {
        for (let confirmedTransactionHash in confirmedTransactions) {
            txs.push(confirmedTransactions[confirmedTransactionHash])
        }
        txs = txs.sort((a, b) => b.block.timestamp - a.block.timestamp)
    }
    return txs
}

// Transaction List View
export default function ConfirmedTransactionList({
    transactionList,
    walletAddress,
    transactionsLoaded,
    transactionsAvailable
}) {

    if (!transactionsLoaded || !transactionsAvailable) {
        return (
          <div></div>
        )
    }

    let sortedTransactions = getSortedTransactions(transactionList)
    return (
        <div className="col-10 offset-1 offset-md-0 col-md-12 transactions px-0 mt-4">
            <h3>CONFIRMED</h3>
            {sortedTransactions.map(tx => (
                <ConfirmedTransactionListItem
                    key={tx.hash}
                    transaction={tx}
                    walletAddress={walletAddress}
                />
            ))}
        </div>
    )
}
