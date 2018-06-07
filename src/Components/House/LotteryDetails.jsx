import React from 'react'
import { Card, CardHeader, CardText } from 'material-ui'
import { injectIntl } from 'react-intl'
import { componentMessages, getI18nFn } from '../../i18n/componentMessages'

const styles = require('../Base/styles').styles

const messages = componentMessages('src.Components.House.LotteryDetails', [
    'TicketsSold',
    'Payout',
    'WinnerAnnounced',
    'Statistics',
    { Yes: 'common.Yes' },
    { No: 'common.No' }
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
                            {lottery.finalized ? <span className="text-success">{i18n('Yes')}</span> :
                                <span className="text-danger">{i18n('No')}</span>}
                        </td>
                    </tr>
                </tbody>
            </table>
        )
    }
    return (
        <Card className="hvr-float" style={styles.card}>
            <CardHeader title={i18n('Statistics')}/>
            <CardText>{inner}</CardText>
        </Card>
    )
}

export default injectIntl(LotteryDetails)