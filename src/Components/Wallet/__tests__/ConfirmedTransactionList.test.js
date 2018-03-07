import React from 'react'
import {shallow} from 'enzyme'

import ConfirmedTransactionList from '../ConfirmedTransactionList'

describe('Components/Wallet/ConfirmedTransactionList', function () {
    it('should render without throwing an error', function () {
        const wrapper = shallow(<ConfirmedTransactionList/>)
        expect(wrapper.find('.transactions').length).toBe(1)
    })
})