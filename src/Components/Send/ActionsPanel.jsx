import React from 'react'
import { FlatButton, RaisedButton } from 'material-ui'
import { Card, CardText, CardActions } from 'material-ui/Card'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
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
            <CardText>
                <FlatButton
                    className="d-block"
                    disabled={isLoading}
                    label={i18n('SendAll')}
                    onClick={onSelectAllListener}
                />
            </CardText>

            <CardActions>
                <RaisedButton
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
