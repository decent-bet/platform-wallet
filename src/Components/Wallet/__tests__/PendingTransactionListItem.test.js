import React from 'react'
import {shallow} from 'enzyme'

import PendingTransactionListItem from '../PendingTransactionListItem'

describe('Components/Wallet/PendingTransactionListItem', function () {
    it('should render without throwing an error', function () {
        const wrapper = shallow(<PendingTransactionListItem transaction={{hash: '', to: '', from: ''}}/>)
        expect(wrapper.find('.tx').length).toBe(1)
    })
})
