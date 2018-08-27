import React from 'react'
import {
    Card,
    CardHeader,
    CardContent,
    CardActions
} from '@material-ui/core'
import { Button, IconButton } from '@material-ui/core'
import { injectIntl } from 'react-intl'
import SendIcon from '@material-ui/icons/Send'
import { componentMessages, getI18nFn } from '../../i18n/componentMessages'
import Typography from '@material-ui/core/Typography'
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
            <CardContent className="balance">
                <Typography component="p">{tokenBalance}</Typography>
                <img className="icon" src={imageSrc} alt="dbet-icon" />
            </CardContent>

            <CardActions className="wallet-actions">
                <IconButton onClick={onSendListener}>
                    {i18n('SendDBETs')}
                    <SendIcon />
                </IconButton>
            </CardActions>
        </Card>
    )
}

export default injectIntl(WalletBalance)
