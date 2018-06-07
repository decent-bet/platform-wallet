import React, { Fragment } from 'react'
import { Card, CardHeader, CardText } from 'material-ui'
import { injectIntl } from 'react-intl'
import { componentMessages, getI18nFn } from '../../i18n/componentMessages'

const styles = require('../Base/styles').styles

const messages = componentMessages('src.Components.House.HouseStats', [
    'CreditsAvailable',
    'CurrentSession',
    'AuthorizedAddresses',
    'Credits'
])

function HouseStats({ intl, currentSession, authorizedAddresses, availableCredits }) {
    const i18n = getI18nFn(intl, messages)
    const SESSION_ZERO_MESSAGE = '(Displaying stats for session 1)'
    return (
        <Fragment>
            <Card className="hvr-float" style={styles.card}>
                <CardHeader title={i18n('CurrentSession')}/>
                {/*TODO: Is this currentSession below supposed to show the full text as from SESSION_ZERO_MESSAGE or only the number
                as it is programmed now? */}
                <CardText>{currentSession} {currentSession === '0' && SESSION_ZERO_MESSAGE}</CardText>
            </Card>
            <Card className="hvr-float" style={styles.card}>
                <CardHeader title={i18n('AuthorizedAddresses')}/>
                <CardText>
                    <ul>
                        {authorizedAddresses.map((address, index) => (
                            <li key={index}>{address}</li>
                        ))}
                    </ul>
                </CardText>
            </Card>
            <Card className="hvr-float" style={styles.card}>
                <CardHeader title={i18n('CreditsAvailable')}/>
                <CardText>
                    {i18n('Credits', { credits: availableCredits ? availableCredits : '0' })}
                </CardText>1 {/*TODO: Should this 1 really be here? */}
            </Card>
        </Fragment>
    )
}

export default injectIntl(HouseStats)