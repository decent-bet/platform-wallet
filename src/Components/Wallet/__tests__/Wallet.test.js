import React from 'react'
import {shallow} from 'enzyme'
import Wallet from '../Wallet'
import * as constants from "../../Constants"

describe('Components/Wallet/Wallet', function () {
    it('should render without throwing an error', function () {
        const wrapper = shallow(<Wallet/>)
        expect(wrapper.find('.wallet').length).toBe(1)
    })
    it('should render with the case of TOKEN_TYPE_DBET_TOKEN_NEW', function () {
        const wrapper = shallow(<Wallet selectedTokenContract={constants.TOKEN_TYPE_DBET_TOKEN_NEW}/>)
        expect(wrapper.find('.wallet').length).toBe(1)
    })
    it('should render with the case of TOKEN_TYPE_DBET_TOKEN_OLD', function () {
        const wrapper = shallow(<Wallet selectedTokenContract={constants.TOKEN_TYPE_DBET_TOKEN_OLD}/>)
        expect(wrapper.find('.wallet').length).toBe(1)
    })
})