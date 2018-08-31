import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {Typography, ButtonBase} from '@material-ui/core'
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
                <ButtonBase focusRipple="true" stlye={{margin: '0 !important'}} onClick={this.onOpenHashListener}>
                    <Typography>Hash:{' '}{transaction.hash}</Typography>
                </ButtonBase>
                    <Typography>
                    Destination:{' '}
                        <span className="monospace">
                            {helper.formatAddress(transaction.to)}
                        </span>
                    </Typography>
                    <Typography variant="caption">Pending</Typography>
                </section>
                <Typography variant="display2">{helper.formatNumber(transaction.value)}</Typography>
            </article>
        )
    }
}
