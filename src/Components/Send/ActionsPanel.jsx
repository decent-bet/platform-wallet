import React, { Component } from 'react'
import { Button } from '@material-ui/core'
import { Card, CardContent, CardActions, Typography } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { injectIntl } from 'react-intl'
import { componentMessages, getI18nFn } from '../../i18n/componentMessages'

const messages = componentMessages('src.Components.Send.ActionsPanel', [
    { Loading: 'common.Loading' },
    'SendAll',
    'SendDBETs'
])

class ActionsPanel extends Component {
    render() {
        const {
            intl,
            tokenBalance,
            onSelectAllListener,
            onSendListener,
            canSend
        } = this.props
        const i18n = getI18nFn(intl, messages)
        let isLoading = tokenBalance === 0 || tokenBalance === i18n('Loading')
        return (
            <Card className="actions-panel">
                <CardActions>
                    <Button
                        className="d-block"
                        disabled={isLoading}
                        onClick={onSelectAllListener}
                    >
                        {i18n('SendAll')}
                    </Button>
                    <Button
                        variant="contained"
                        className="d-block"
                        disabled={!canSend}
                        fullWidth={true}
                        onClick={onSendListener}
                    >
                        <FontAwesomeIcon icon="paper-plane" />
                        {i18n('SendDBETs')}
                    </Button>
                </CardActions>
            </Card>
        )
    }
}
export default injectIntl(ActionsPanel)
