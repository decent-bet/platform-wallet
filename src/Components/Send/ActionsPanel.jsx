import React from 'react'
import { FlatButton, Divider, RaisedButton } from 'material-ui'
import { Card, CardText, CardActions } from 'material-ui/Card'

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
                    icon={<i className="fa fa-expand" />}
                    label="Select All"
                    onClick={onSelectAllListener}
                />
            </CardText>

            <CardActions>
              <RaisedButton
                    className="d-block"
                    disabled={!canSend}
                    fullWidth={true}
                    icon={<i className="fa fa-paper-plane-o" />}
                    label="Send DBETs"
                    onClick={onSendListener}
                    primary={true}
                />
            </CardActions>
        </Card>
    )
}
