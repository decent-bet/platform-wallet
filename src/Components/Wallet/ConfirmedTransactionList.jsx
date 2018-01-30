import React from 'react'
import { LinearProgress } from 'material-ui'

import ConfirmedTransactionListItem from './ConfirmedTransactionListItem.jsx'

const constants = require('../Constants')

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
    if (!transactionsLoaded) {
        // Loading Screen
        return (
            <div className="col-12 pt-4 mt-4 loading-transactions">
                <LinearProgress color={constants.COLOR_GOLD} />
                <h3>Loading Confirmed Transactions..</h3>
            </div>
        )
    } else if (transactionsLoaded && !transactionsAvailable) {
        // Empty Screen
        return (
            <div className="col-12 mt-4 no-transactions">
                <h3>No Transaction History yet</h3>
                <p>Future token transfers will be listed here</p>
            </div>
        )
    } else {
        // List of Transactions
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
}
