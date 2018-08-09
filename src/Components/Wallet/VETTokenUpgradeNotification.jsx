import React, { Fragment } from 'react'
import { FlatButton } from 'material-ui'
import Helper from '../Helper'

const helper = new Helper()
const constants = require('../Constants')

export default function VETTokenUpgradeNotification(
    oldTokenBalance,
    onAcceptListener,
    onLearnMoreListener
) {
    let formattedTokens = helper.formatDbets(oldTokenBalance)
    let text = `Looks like you have ${formattedTokens} tokens remaining in the ERC20 Decent.bet token contract`
    return {
        title: 'Token Migration to Vechain Thor (VET)',
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
                <FlatButton
                    label="Click to upgrade now"
                    onClick={onAcceptListener}
                />
                <FlatButton label="Learn more" onClick={onLearnMoreListener} />
            </Fragment>
        ),
        style: {
            height: '100% !important',
            whiteSpace: 'inherit !important',
            overflow: 'inherit !important'
        }
    }
}
