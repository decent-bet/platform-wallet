import React from 'react'
import { Card, CardHeader, CardText, CardActions } from 'material-ui/Card'
import { RaisedButton } from 'material-ui'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { injectIntl } from 'react-intl'
import { componentMessages, getI18nFn } from '../../i18n/componentMessages'

const messages = componentMessages('src.Components.Wallet.WalletBalance', [
    'TotalDBETs',
    'SendDBETs'
])

function WalletBalance({ intl, onSendListener, tokenBalance }) {
    const i18n = getI18nFn(intl, messages)
    let imageSrc = `${process.env.PUBLIC_URL}/assets/img/icons/dbet.png`
    return (
        <Card>
            <CardHeader title={i18n('TotalDBETs')} />
            <CardText className="balance">
                <p>{tokenBalance}</p>
                <img className="icon" src={imageSrc} alt="dbet-icon" />
            </CardText>

            <CardActions className="wallet-actions">
                <RaisedButton
                    primary={true}
                    onClick={onSendListener}
                    icon={<FontAwesomeIcon icon="paper-plane" />}
                    label={i18n('SendDBETs')}
                />
            </CardActions>
        </Card>
    )
}

export default injectIntl(WalletBalance)
