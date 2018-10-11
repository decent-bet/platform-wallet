import React, { Fragment } from 'react'
import { Button } from '@material-ui/core'
import Helper from '../Helper'

const helper = new Helper()
const constants = require('../Constants')

export default function TokenUpgradeNotification(
    oldTokenBalance,
    onAcceptListener,
    onLearnMoreListener
) {
    let formattedTokens = helper.formatDbets(oldTokenBalance)
    let text = `Looks like you have ${formattedTokens} tokens remaining in the original Decent.bet token contract`
    return {
        title: 'Token Upgrade',
        additionalText: text,
        icon: (
            <img
                src={process.env.PUBLIC_URL + '/assets/img/icons/dbet.png'}
                className="dbet-icon"
                alt="dbet-icon"
            />
        ),
        iconBadgeColor: constants.COLOR_TRANSPARENT,
        overflowText: (
            <Fragment>
                <Button
                    label="Click to upgrade now"
                    onClick={onAcceptListener}
                />
                <Button label="Learn more" onClick={onLearnMoreListener} />
            </Fragment>
        ),
        style: {
            height: '100% !important',
            whiteSpace: 'inherit !important',
            overflow: 'inherit !important'
        }
    }
}
