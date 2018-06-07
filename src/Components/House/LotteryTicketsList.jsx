import React from 'react'
import { injectIntl } from 'react-intl'
import { componentMessages, getI18nFn } from '../../i18n/componentMessages'
import Helper from '../Helper'
import LotteryTicketsListItem from './LotteryTicketsListItem'

const helper = new Helper()

const messages = componentMessages('src.Components.House.LotteryTicketsList', [
    'NoLotteriesYet',
    'AccountNotYetLoaded',
    'NoLotteryTicketsForYourAddress',
    'TicketNumber'
])
/**
 * Lists all the current Lottery Tickets for this wallet.
 * @param {Lottery} lottery Current Lottery
 */
function LotteryTicketsList({ intl, lottery }) {
    const i18n = getI18nFn(intl, messages)
    const noLotteriesYet = i18n('NoLotteriesYet')
    const accountNotYetLoaded = i18n('AccountNotYetLoaded')
    const noLotteryTicketsForYourAddress = i18n('NoLotteryTicketsForYourAddress')
    const ticketNumber = i18n('TicketNumber')
    if (!lottery) {
        return <p>{noLotteriesYet}</p>
    }

    let account = helper.getDevWeb3().eth.defaultAccount
    if (!account) {
        return <p>{accountNotYetLoaded}</p>
    }

    let lotteryTickets = lottery.tickets
    if (!lotteryTickets) {
        return <p>{noLotteryTicketsForYourAddress}</p>
    }

    return (
        <table className="table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>{ticketNumber}</th>
                </tr>
            </thead>

            <tbody>
                {lotteryTickets.map((ticket, index) => (
                    <LotteryTicketsListItem
                        key={ticket}
                        index={index}
                        ticket={ticket}
                    />
                ))}
            </tbody>
        </table>
    )
}

export default injectIntl(LotteryTicketsList)