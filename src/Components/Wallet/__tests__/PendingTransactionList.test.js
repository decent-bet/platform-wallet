import React from 'react'
import {shallow} from 'enzyme'

import PendingTransactionList from '../PendingTransactionList'

describe('Components/Wallet/PendingTransactionList', function () {
    it('should render when passing a transaction list > 1', function () {
        const wrapper = shallow(PendingTransactionList({pendingTransactionsList: [{}]}))
        expect(wrapper.find('.transactions').length).toBe(1)
    })
    it('should render an empty span when passing a transaction list < 1', function () {
        const wrapper = shallow(PendingTransactionList({pendingTransactionsList: []}))
        expect(wrapper.find('.transactions').length).toBe(0)
        expect(wrapper.find('span').length).toBe(1)
    })
})
