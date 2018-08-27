import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import Helper from '../Helper'

const helper = new Helper()

export default class PendingTransactionListItem extends Component {
    // Creates a listener to open the account on Etherscan
    onOpenHashListener = () => {
        let hash = this.props.transaction.hash
        helper.openUrl(`https://etherscan.io/tx/${hash}`)
    }

    render() {
        let transaction = this.props.transaction
        return (
            <article className="tx">
                <div className="icon">
                    <FontAwesomeIcon icon="plus" />
                </div>
                <section className="text">
                    <div className="type">Send DBETs</div>
                    <div
                        className="hash"
                        onClick={this.onOpenHashListener}
                    >
                        Hash:{' '}
                        <span className="monospace">{transaction.hash}</span>
                    </div>
                    <div className="address">
                        Destination:{' '}
                        <span className="monospace">
                            {helper.formatAddress(transaction.to)}
                        </span>
                    </div>
                    <div className="timestamp">Pending</div>
                </section>
                <div className="value">
                    {helper.formatNumber(transaction.value)}
                </div>
            </article>
        )
    }
}
