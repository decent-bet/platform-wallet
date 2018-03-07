import React from 'react'
import {shallow} from 'enzyme'

import PendingTransactionList from '../PendingTransactionList'

describe('Components/Wallet/PendingTransactionList', function () {
    it('should render without throwing an error', function () {
        const wrapper = shallow(PendingTransactionList({pendingTransactionsList:[{}]}))
        expect(wrapper.find('.transactions').length).toBe(1)
    })
})
