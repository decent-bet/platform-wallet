import React, { Component, Fragment } from 'react'
import moment from 'moment'

import Helper from '../Helper'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

const helper = new Helper()

// Icon at the left
const Icon = ({ stateMachine }) => {
    if (stateMachine === 'SENT') {
        return <FontAwesomeIcon icon="minus" />
    } else if (stateMachine === 'RECEIVED') {
        return <FontAwesomeIcon icon="plus" />
    } else if (stateMachine === 'UPGRADED') {
        return <FontAwesomeIcon icon="arrow-up" />
    } else {
        return <span />
    }
}

// Text Content
const ItemContent = ({ stateMachine, transaction, onClickListener }) => {
    let texts = {
        type: '',
        address: ''
    }

    if (stateMachine === 'SENT') {
        texts.type = 'Sent DBETs'
        texts.address = (
            <Fragment>
                Destination:{' '}
                <span className="monospace">
                    {helper.formatAddress(transaction.to)}
                </span>
            </Fragment>
        )
    } else if (stateMachine === 'RECEIVED') {
        texts.type = 'Received DBETs'
        texts.address = (
            <Fragment>
                Origin:{' '}
                <span className="monospace">
                    {helper.formatAddress(transaction.from)}
                </span>
            </Fragment>
        )
    } else if (stateMachine === 'UPGRADED') {
        texts.type = 'Upgraded DBETs'
        texts.address = 'From V1 Contract'
    } else if (stateMachine === 'UPGRADED_TO_VET_FROM_V1') {
        texts.type = 'Upgraded DBETs to VET'
        texts.address = 'From V1 Contract'
    } else if (stateMachine === 'UPGRADED_TO_VET_FROM_V2') {
        texts.type = 'Upgraded DBETs to VET'
        texts.address = 'From V2 Contract'
    }

    return (
        <Fragment>
            <div className="type">{texts.type}</div>
            <div className="hash" onClick={onClickListener}>
                Hash: <span className="monospace">{transaction.hash}</span>
            </div>
            <div className="address">{texts.address}</div>
        </Fragment>
    )
}

// Wrapper Element
export default class ConfirmedTransactionListItem extends Component {
    // Creates an event listener to open the transaction on Etherscan
    openOnEtherscanListener = () => {
        let hash = this.props.transaction.hash
        if (hash) {
            helper.openUrl(`https://etherscan.io/tx/${hash}`)
        }
    }

    render() {
        let { transaction, walletAddress } = this.props
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
            <article className="tx">
                <div className="icon">
                    <Icon stateMachine={stateMachine} />
                </div>
                <section className="text">
                    <ItemContent
                        stateMachine={stateMachine}
                        transaction={transaction}
                        onClickListener={this.openOnEtherscanListener}
                    />
                    <div className="timestamp">
                        Time: <span className="monospace">{timestamp}</span>
                    </div>
                </section>
                <div className="value">
                    {helper.formatNumber(transaction.value)}
                </div>
            </article>
        )
    }
}
