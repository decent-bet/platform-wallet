import React from 'react'
import {shallow} from 'enzyme'
import Wallet from '../Wallet'

describe('Components/Wallet/Wallet', function () {
    it('should render without throwing an error', function () {
        const wrapper = shallow(<Wallet/>)
        expect(wrapper.find('.wallet').length).toBe(1)
    })
})