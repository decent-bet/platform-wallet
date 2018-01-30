import React from 'react'

import Helper from '../Helper'

const helper = new Helper()

export default function PendingTransactionListItem({ transaction }) {
    return (
        <div className="tx">
            <div className="row h-100">
                <div className="col-2 my-auto">
                    <i className="fa fa-paper-plane-o" />
                </div>
                <div className="col-6 col-md-7 pt-3">
                    <section>
                        <p className="type">Send DBETs</p>
                        <p
                            className="hash"
                            onClick={() => {
                                helper.openUrl(
                                    `https://etherscan.io/tx/${
                                        transaction.hash
                                    }`
                                )
                            }}
                        >
                            {transaction.hash}
                        </p>
                        <p className="address">
                            To: {helper.formatAddress(transaction.to)}
                        </p>
                    </section>
                    <p className="timestamp">Pending</p>
                </div>
                <div className="col-4 col-md-3 pt-2 pl-0">
                    <p className="value">{helper.formatNumber(transaction.value)}</p>
                </div>
            </div>
        </div>
    )
}
