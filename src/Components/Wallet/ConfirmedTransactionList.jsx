import React from 'react'
import { LinearProgress } from 'material-ui'
import { Card, CardText, CardHeader } from 'material-ui/Card'

import ConfirmedTransactionListItem from './ConfirmedTransactionListItem.jsx'

// Parse the confirmed transactions
function getSortedTransactions(confirmedTransactions) {
    let txs = []
    if (confirmedTransactions) {
        for (let hash in confirmedTransactions) {
            if (confirmedTransactions.hasOwnProperty(hash)) {
                txs.push(confirmedTransactions[hash])
            }
        }
    }
    txs = txs.sort((a, b) => b.block.timestamp - a.block.timestamp)
    return txs
}

// Transaction List View
export default function ConfirmedTransactionList({
    transactionList,
    walletAddress,
    transactionsLoaded
}) {
    let sortedTransactions = getSortedTransactions(transactionList)
    if (!transactionsLoaded) {
        // Loading Screen
        return (
            <Card className="transactions">
                <CardHeader title="Loading Confirmed Transactions" />
                <CardText>
                    <LinearProgress />
                </CardText>
            </Card>
        )
    } else if (transactionsLoaded && sortedTransactions.length < 1) {
        // Empty Screen
        return (
            <Card className="transactions">
                <CardHeader title="No Transaction History yet" />
                <CardText>Future token transfers will be listed here
                </CardText>
            </Card>
        )
    } else {
        return (
            <Card className="transactions">
                <CardHeader title="Confirmed Transactions" />
                <CardText>
                    {sortedTransactions.map(tx => (
                        <ConfirmedTransactionListItem
                            key={tx.hash}
                            transaction={tx}
                            walletAddress={walletAddress}
                        />
                    ))}
                </CardText>
            </Card>
        )
    }
}
