import React from 'react'
import { shallowWithIntl } from '../../../i18n/enzymeHelper'
import Wallet from '../Wallet'
import * as constants from "../../Constants"

//TODO: Fix unit tests for better working with i18n
describe.skip('Components/Wallet/Wallet', function () {
    it('should render without throwing an error', function () {
        const wrapper = shallowWithIntl(<Wallet/>)
        expect(wrapper.find('.wallet').length).toBe(1)
    })
    it('should render with the case of TOKEN_TYPE_DBET_TOKEN_NEW', function () {
        const wrapper = shallowWithIntl(<Wallet selectedTokenContract={constants.TOKEN_TYPE_DBET_TOKEN_NEW}/>)
        expect(wrapper.find('.wallet').length).toBe(1)
    })
    it('should render with the case of TOKEN_TYPE_DBET_TOKEN_OLD', function () {
        const wrapper = shallowWithIntl(<Wallet selectedTokenContract={constants.TOKEN_TYPE_DBET_TOKEN_OLD}/>)
        expect(wrapper.find('.wallet').length).toBe(1)
    })
})