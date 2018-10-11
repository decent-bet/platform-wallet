import React from 'react'
import { shallowWithIntl } from '../../../i18n/enzymeHelper'
import WalletBalance from '../WalletBalance'

//TODO: Fix unit tests for better working with i18n
describe.skip('Components/Wallet/WalletBalance', function () {
    it('should render without throwing an error', function () {
        const wrapper = shallowWithIntl(<WalletBalance/>)
        expect(wrapper.find('.wallet-actions').length).toBe(1)
    })
})