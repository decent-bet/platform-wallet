import React from 'react'
import { Card, CardHeader, CardText } from 'material-ui'

const styles = require('../Base/styles').styles
import { injectIntl } from 'react-intl'
import { componentMessages, getI18nFn } from '../../i18n/componentMessages'

const messages = componentMessages('src.Components.House.LotteryDetails', [
    'TicketsSold',
    'Payout',
    'WinnerAnnounced'
])
/**
 * Prints all the Lottery details in a Card
 * @param {Lottery} lottery Current Lotery
 */
function LotteryDetails({ intl, lottery }) {
    const i18n = getI18nFn(intl, messages)
    let inner = ''
    if (lottery) {
        inner = (
            <table className="card-table">
                <tbody>
                    <tr>
                        <th>{i18n('TicketsSold')}</th>
                        <td>{lottery.ticketCount} tickets</td>
                    </tr>
                    <tr>
                        <th>{i18n('Payout')}</th>
                        <td>{lottery.payout} DBETs</td>
                    </tr>
                    <tr>
                        <th>{i18n('WinnerAnnounced')}</th>
                        <td>
                            {lottery.finalized ? (
                                <span className="text-success">YES</span>
                            ) : (
                                <span className="text-danger">NO</span>
                            )}
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }
    return (
        <Card className="hvr-float" style={styles.card}>
            <CardHeader title="Statistics" />
            <CardText>{inner}</CardText>
        </Card>
    )
}

export default injectIntl(LotteryDetails)