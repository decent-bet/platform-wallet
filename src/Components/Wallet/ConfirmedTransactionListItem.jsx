import React, { Component, Fragment } from 'react'
import moment from 'moment'
import { Config } from '../Config'
import Helper from '../Helper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Typography, ButtonBase} from '@material-ui/core'
const helper = new Helper()
const Constants = require('../Constants')

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
            <Typography>
                Destination:{' '}
                <span className="hash">
                    {helper.formatAddress(transaction.to)}
                </span>
            </Typography>
        )
    } else if (stateMachine === 'RECEIVED') {
        texts.type = 'Received DBETs'
        texts.address = (
            <Typography>
                Origin:{' '}
                <span className="hash">
                    {helper.formatAddress(transaction.from)}
                </span>
            </Typography>
        )
    } else if (stateMachine === 'UPGRADED' && !transaction.isVET) {
        const upgradedTo = transaction.to === Config.depositAddress ? 'VET' : 'V2'
        texts.type = `Upgraded DBETs to ${upgradedTo}`
        texts.address = ''
    } else if (stateMachine === 'UPGRADED' && transaction.isVET) {
        texts.type = 'Upgraded DBETs to VET'
        texts.address = ''
    }

    return (
        <Fragment>
            <Typography color="primary">{texts.type}</Typography>
            <ButtonBase
                        focusRipple={true}
                        style={{ margin: '0 !important'}}
                        onClick={onClickListener}
                    >
                        <Typography>
                        Hash:{' '}
                        <span className="hash">
                            {helper.formatAddress(transaction.hash)}
                        </span>
                        </Typography>
                    </ButtonBase>
                    {texts.address}
        </Fragment>
    )
}

// Wrapper Element
export default class ConfirmedTransactionListItem extends Component {
    // Creates an event listener to open the transaction on Etherscan
    openOnEtherscanListener = () => {
        let hash = this.props.transaction.hash
        if (hash) {
            if (this.props.transaction.isVET) {
                helper.openUrl(`${Config.veforgeUrl}/transactions/${hash}`)
            } else {
                helper.openUrl(`${Config.etherscanUrl}/tx/${hash}`)
            }
        }
    }

    render() {
        let { transaction, walletAddress } = this.props
        // Set the State Machine to the proper display
        let stateMachine

        if (
            transaction.to.toLowerCase() ===
            Config.v1UpgradeAgentAddress.toLowerCase() ||
            transaction.to.toLowerCase() ===
            Config.depositAddress.toLowerCase() ||
            transaction.to.toLowerCase() ===
            transaction.from.toLowerCase()
        ) {
            stateMachine = 'UPGRADED'
        } else if (
            transaction.from.toLowerCase() === walletAddress &&
            transaction.to.toLowerCase() !== walletAddress
        ) {
            stateMachine = 'SENT'
        } else if (
            transaction.to.toLowerCase() === walletAddress &&
            transaction.from.toLowerCase() !== walletAddress
        ) {
            stateMachine = 'RECEIVED'
        }
        let timestamp = moment
            .unix(transaction.block.timestamp)
            .format('YYYY-MM-DD HH:mm:SS')
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
                    <Typography variant="caption">{timestamp}</Typography>
                </section>
                <Typography variant="h4">{helper.formatNumber(transaction.value)}</Typography>
            </article>
        )
    }
}
