import React from 'react'
import { LinearProgress } from 'material-ui'
import { Card, CardText, CardHeader } from 'material-ui/Card'
import { injectIntl } from 'react-intl'
import { componentMessages, getI18nFn } from '../../i18n/componentMessages'
import ConfirmedTransactionListItem from './ConfirmedTransactionListItem.jsx'

const messages = componentMessages(
    'src.Components.Wallet.ConfirmedTransactionList',
    [
        'NoTransactionHistory',
        'FutureTokenTransfersListedHere',
        'LoadingConfirmedTransactions'
    ]
)

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
function ConfirmedTransactionList({
    intl,
    transactionList,
    walletAddress,
    transactionsLoaded
}) {
    const i18n = getI18nFn(intl, messages)
    let sortedTransactions = getSortedTransactions(transactionList)
    if (!transactionsLoaded) {
        // Loading Screen
        return (
            <Card className="transactions">
                <CardHeader title={i18n('LoadingConfirmedTransactions')} />
                <CardText>
                    <LinearProgress />
                </CardText>
            </Card>
        )
    } else if (transactionsLoaded && sortedTransactions.length < 1) {
        // Empty Screen
        return (
            <Card className="transactions">
                <CardHeader title={i18n('NoTransactionHistory')} />
                <CardText>{i18n('FutureTokenTransfersListedHere')}</CardText>
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
export default injectIntl(ConfirmedTransactionList)
