import React from 'react'
import {shallow} from 'enzyme'
import WalletBalance from '../WalletBalance'

describe('Components/Wallet/WalletBalance', function () {
    it('should render without throwing an error', function () {
        const wrapper = shallow(<WalletBalance/>)
        expect(wrapper.find('.wallet-actions').length).toBe(1)
    })
})