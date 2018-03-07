import React from 'react'
import {shallow} from 'enzyme'
import WalletHeader from '../WalletHeader'

describe('Components/Wallet/WalletHeader', function () {
    it('should render without throwing an error', function () {
        const wrapper = shallow(<WalletHeader/>)
        expect(wrapper.find('.wallet-header').length).toBe(1)
    })
})