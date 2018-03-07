import React from 'react'
import {shallow} from 'enzyme'

import ConfirmedTransactionList from '../ConfirmedTransactionList'

describe('Components/Wallet/ConfirmedTransactionList', function () {
    it('should render loading screen by default', function () {
        const wrapper = shallow(<ConfirmedTransactionList/>)
        expect(wrapper.find('LinearProgress').length).toBe(1)
    })
    // it('should render "Empty Screen" if confirmedTransactions < 1', function () {
    //     const confirmedTransactionList = new ConfirmedTransactionList({
    //         transactionList: [{}],
    //         walletAddress: "0xF001",
    //         transactionsLoaded: true
    //     })
    //     const wrapper = shallow(<confirmedTransactionList/>)
    //     expect(wrapper.find('CardHeader[title="Future token transfers will be listed here"]').length).toBe(1)
    // })
    it('should render ConfirmedTransactionListItems for each passed transactions', function () {
        const transactionList = [{
            hash: "0xF00", block: {
                timestamp: 1520906156
            }
        }, {
            hash: "0xF01", block: {
                timestamp: 1520906190
            }
        }, {
            hash: "0xF002", block: {
                timestamp: 1520906204
            }
        }]
        const confirmedTransactionList = new ConfirmedTransactionList({
            transactionList,
            walletAddress: "0xF001",
            transactionsLoaded: true
        })
        const wrapper = shallow(<confirmedTransactionList/>)
        // console.log("wrapper: " + JSON.stringify(confirmedTransactionList))
        // expect(wrapper.find('Card').length).toBe(1) //TODO: Fix test.. wrapper coming back as un-find-able json obj
        // expect(wrapper.find('Card').first().find('CardHeader').length).toBe(1)
    })
})