import React from 'react'
import { Card, CardHeader, CardText, CardActions } from 'material-ui/Card'
import { RaisedButton } from 'material-ui'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

export default function WalletBalance({onSendListener, tokenBalance}) {
    let imageSrc = `${process.env.PUBLIC_URL}/assets/img/icons/dbet.png`
    return (
        <Card>
            <CardHeader title="Total DBETs" />
            <CardText className="balance">
                <p>{tokenBalance}</p>
                <img className="icon" src={imageSrc} alt="dbet-icon" />
            </CardText>

            <CardActions className="wallet-actions">
                <RaisedButton
                    primary={true}
                    onClick={onSendListener}
                    icon={<FontAwesomeIcon icon="paper-plane" />}
                    label="Send DBETs"
                />
            </CardActions>
        </Card>
    )
}
