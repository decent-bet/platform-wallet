import React, { Component, Fragment } from 'react'
import moment from 'moment'
import { ETHERSCAN, VEFORGE } from '../Constants'
import Helper from '../Helper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Typography, ButtonBase} from '@material-ui/core'
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
        texts.type = 'Upgraded DBETs'
        texts.address = (<Typography>From V1 Contract</Typography>)
    } else if (stateMachine === 'UPGRADED' && transaction.isVET) {
        texts.type = 'Upgraded DBETs to VET'
        texts.address = ''
    } else if (stateMachine === 'UPGRADED_TO_VET_FROM_V2') {
        texts.type = 'Upgraded DBETs to VET'
        texts.address = (<Typography>From V2 Contract</Typography>)
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
                helper.openUrl(`${VEFORGE}/transactions/${hash}`)
            } else {
                helper.openUrl(`${ETHERSCAN}/tx/${hash}`)
            }
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
                <Typography variant="display2">{helper.formatNumber(transaction.value)}</Typography>
            </article>
        )
    }
}
