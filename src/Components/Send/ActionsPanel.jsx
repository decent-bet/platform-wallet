import React from 'react'
import { FlatButton, RaisedButton } from 'material-ui'
import { Card, CardText, CardActions } from 'material-ui/Card'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

const constants = require('../Constants')

export default function ActionPanel({
    tokenBalance,
    canSend,
    onSelectAllListener,
    onSendListener
}) {
    let isLoading =
        tokenBalance === 0 || tokenBalance === constants.TOKEN_BALANCE_LOADING
    return (
        <Card className="actions-panel">
            <CardText>
                <FlatButton
                    className="d-block"
                    disabled={isLoading}
                    icon={<FontAwesomeIcon icon='expand-arrows-alt' />}
                    label="Select All"
                    onClick={onSelectAllListener}
                />
            </CardText>

            <CardActions>
              <RaisedButton
                    className="d-block"
                    disabled={!canSend}
                    fullWidth={true}
                    icon={<FontAwesomeIcon icon='paper-plane' />}
                    label="Send DBETs"
                    onClick={onSendListener}
                    primary={true}
                />
            </CardActions>
        </Card>
    )
}
