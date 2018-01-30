import React from 'react'
import moment from 'moment'

import Helper from '../Helper'

const helper = new Helper()

// Creates an event listener to open the transaction on Etherscan
function openOnEtherscan(hash) {
    return event => helper.openUrl(`https://etherscan.io/tx/${hash}`)
}

// Icon at the left
const Icon = ({ stateMachine }) => {
    var icon_class = ''
    if (stateMachine === 'SENT') {
        icon_class = 'fa-paper-plane-o'
    } else if (stateMachine === 'RECEIVED') {
        icon_class = 'fa-plus-circle'
    } else if (stateMachine === 'UPGRADED') {
        icon_class = 'fa-arrow-up'
    }
    return <i className={`fa ${icon_class}`} />
}

// Text Content
const ItemContent = ({ stateMachine, transaction }) => {
    let texts = {
        type: '',
        address: ''
    }

    if (stateMachine === 'SENT') {
        texts.type = 'Sent DBETs'
        texts.address = (
            <p className="address">
                <span className="label">To: </span>
                {helper.formatAddress(transaction.to)}
            </p>
        )
    } else if (stateMachine === 'RECEIVED') {
        texts.type = 'Received DBETs'
        texts.address = (
            <p className="address">
                <span className="label">From: </span>
                {helper.formatAddress(transaction.from)}
            </p>
        )
    } else if (stateMachine === 'UPGRADED') {
        texts.type = 'Upgraded DBETs'
        texts.address = <p className="address">From V1 Contract</p>
    }

    return (
        <section>
            <p className="type">{texts.type}</p>
            <p className="hash" onClick={openOnEtherscan(transaction.hash)}>
                {transaction.hash}
            </p>
            {texts.address}
        </section>
    )
}

// Wrapper Element
export default function ConfirmedTransactionListItem({
    transaction,
    walletAddress
}) {
    // Set the State Machine to the proper display
    let stateMachine
    if (
        transaction.from === walletAddress &&
        transaction.to !== walletAddress
    ) {
        stateMachine = 'SENT'
    } else if (
        transaction.to === walletAddress &&
        transaction.from !== walletAddress
    ) {
        stateMachine = 'RECEIVED'
    } else {
        stateMachine = 'UPGRADED'
    }

    let timestamp = moment
        .unix(transaction.block.timestamp)
        .format('YYYY-MM-DD HH:MM:SS')
    return (
        <div className="tx">
            <div className="row h-100">
                <div className="col-2 my-auto">
                    <Icon stateMachine={stateMachine} />
                </div>
                <div className="col-6 col-md-7 pt-3">
                    <ItemContent
                        stateMachine={stateMachine}
                        transaction={transaction}
                    />
                    <p className="timestamp">Time: {timestamp}</p>
                </div>
                <div className="col-4 col-md-3 pt-2 pl-0">
                    <p className="value">
                        {helper.formatNumber(transaction.value)}
                    </p>
                </div>
            </div>
        </div>
    )
}
