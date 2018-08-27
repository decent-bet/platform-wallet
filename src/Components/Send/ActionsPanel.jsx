import React from 'react'
import { Button } from '@material-ui/core'
import { Card, CardContent, CardActions } from '@material-ui/core/Card'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { injectIntl } from 'react-intl'
import { componentMessages, getI18nFn } from '../../i18n/componentMessages'

const messages = componentMessages('src.Components.Send.ActionsPanel', [
    { Loading: 'common.Loading' },
    'SendAll',
    'SendDBETs'
])

function ActionPanel({
    intl,
    tokenBalance,
    canSend,
    onSelectAllListener,
    onSendListener
}) {
    const i18n = getI18nFn(intl, messages)
    let isLoading =
        tokenBalance === 0 || tokenBalance === i18n('Loading')
    return (
        <Card className="actions-panel">
            <CardContent>
                <Button
                    className="d-block"
                    disabled={isLoading}
                    label={i18n('SendAll')}
                    onClick={onSelectAllListener}
                />
            </CardContent>

            <CardActions>
            <Button variant="contained"
                    className="d-block"
                    disabled={!canSend}
                    fullWidth={true}
                    icon={<FontAwesomeIcon icon="paper-plane" />}
                    label={i18n('SendDBETs')}
                    onClick={onSendListener}
                    primary={true}
                />
            </CardActions>
        </Card>
    )
}
export default injectIntl(ActionPanel)
