/**
 * Created by user on 8/21/2017.
 */

import React, { Component } from 'react'
import { Dialog, RaisedButton, TextField } from 'material-ui'
import { injectIntl } from 'react-intl'
import { componentMessages, getI18nFn } from '../../../i18n/componentMessages'

let i18n
const messages = componentMessages(
    'src.Components.House.Dialogs.PurchaseCreditsDialog',
    ['PurchaseCreditsForSession',
        'NotEnoughCredits',
        'EnterValidAmount',
        'Purchase',
        'Amount',
        'AvailableBalance',
        'NoteIfHaventSetAllowance']
)

class PurchaseCreditsDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            amount: ''
        }
        i18n = getI18nFn(this.props.intl, messages)
    }

    onAmountChangedListener = (event, value) => this.setState({ amount: value })

    isAmountValid = () => {
        let amount = parseInt(this.state.amount, 10)
        let balance = parseInt(this.props.balance, 10)
        if (!amount) {
            // Amount invalid
            return false
        }
        if (amount <= balance) {
            // Valid if over 0
            return amount > 0
        } else {
            // Below Balance
            return false
        }
    }

    onClickListener = event => {
        this.props.onCloseListener()
        this.props.onConfirmListener(this.state.amount)
    }

    render() {
        let adjustedSessionNumber = this.props.sessionNumber === '0' ? 1 : this.props.sessionNumber
        let title = `${'PurchaseCreditsForSession'} ${adjustedSessionNumber}`
        let isValueValid = this.isAmountValid()
        let amount = parseInt(this.state.amount, 10)
        let errorMessage = null
        if (!isValueValid) {
            errorMessage = amount
                ? i18n('NotEnoughCredits', { amount })
                : i18n('EnterValidAmount')
        }
        return (
            <Dialog
                title={title}
                actions={
                    <RaisedButton
                        label={i18n('Purchase')}
                        disabled={!isValueValid}
                        primary={true}
                        onClick={this.onClickListener}
                    />
                }
                modal={false}
                open={this.props.isOpen}
                onRequestClose={this.props.onCloseListener}
            >
                <TextField
                    floatingLabelText={i18n('Amount')}
                    fullWidth={true}
                    type="number"
                    value={this.state.amount}
                    onChange={this.onAmountChangedListener}
                    errorText={errorMessage}
                />
                <small className="color-gold">
                    {i18n('AvailableBalance', { balance: this.props.balance })}
                </small>
                <br />
                <small className="text-white">
                    {i18n('NoteIfHaventSetAllowance', { transactions: 2 })}
                </small>
            </Dialog>
        )
    }
}

export default injectIntl(PurchaseCreditsDialog)