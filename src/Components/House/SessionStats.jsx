import React, { Fragment } from 'react'
import { Card, CardHeader, CardText } from 'material-ui'
import Helper from '../Helper'
import { injectIntl } from 'react-intl'
import { componentMessages, getI18nFn } from '../../i18n/componentMessages'

const messages = componentMessages('src.Components.House.SessionStats', [
    'TotalHouseFunds',
    'TotalHouseCredits',
    'ProfitGenerated',
    {Credits: 'common.Credits'}
])
const helper = new Helper()
const styles = require('../Base/styles').styles

/**
 * Prints all details of the House Funds
 * @param {HouseFunds} houseFunds House Funds
 */
function SessionStats({ intl, houseFunds }) {
    const i18n = getI18nFn(intl, messages)
    let totalFunds = houseFunds
        ? helper.formatEther(houseFunds.totalFunds)
        : '0'

    let totalCredits = houseFunds
        ? helper.formatEther(houseFunds.totalUserCredits)
        : '0'

    let totalProfit = houseFunds ? helper.formatEther(houseFunds.profit) : '0'

    return (
        <Fragment>
            <Card className="hvr-float" style={styles.card}>
                <CardHeader title={i18n('TotalHouseFunds')} />
                <CardText>{totalFunds} DBETs</CardText>
            </Card>
            <Card className="hvr-float" style={styles.card}>
                <CardHeader title={i18n('TotalHouseCredits')} />
                <CardText>{totalCredits} {i18n('Credits')}</CardText>
            </Card>
            <Card className="hvr-float" style={styles.card}>
                <CardHeader title={i18n('ProfitGenerated')} />
                <CardText>{totalProfit} DBETs</CardText>
            </Card>
        </Fragment>
    )
}

export default injectIntl(SessionStats)
