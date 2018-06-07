import React from 'react'
import { Card, CardHeader, CardText } from 'material-ui'
import LotteryTicketsList from './LotteryTicketsList'
import { injectIntl } from 'react-intl'
import { componentMessages, getI18nFn } from '../../i18n/componentMessages'

const styles = require('../Base/styles').styles

const messages = componentMessages('src.Components.House.LotteryTicketsCard', [
    'YourTickets'
])
/**
 * Lists all the current Lottery Tickets for this wallet.
 * @param {Lottery} lottery Current Lottery
 */
function LotteryTicketsCard({ intl, lottery }) {
    const i18n = getI18nFn(intl, messages)
    return (
        <Card className="hvr-float" style={styles.card}>
            <CardHeader title={i18n("YourTickets")} />
            <CardText>
                <LotteryTicketsList lottery={lottery} />
            </CardText>
        </Card>
    )
}

export default injectIntl(LotteryTicketsCard)