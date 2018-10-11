import React from 'react'
import { shallowWithIntl } from '../../../i18n/enzymeHelper'
import Helper, {mockOpenUrl} from '../../Helper'
import WalletHeader from '../WalletHeader'

jest.mock('../../Helper')

//TODO: Fix unit tests for better working with i18n
describe.skip('Components/Wallet/Wallet', function () {
    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        Helper.mockClear()
        mockOpenUrl.mockClear()
    })

    it('should render without throwing an error', function () {
        const wrapper = shallowWithIntl(<WalletHeader/>)
        expect(wrapper.find('.wallet-header').length).toBe(1)
    })

    it('should call helper.openUrl when "View account on Etherscan" is clicked', () => {
        const wrapper = shallowWithIntl(<WalletHeader/>)
        const event = {
            currentTarget: {
                dataset: {address: '0xF00'}
            }
        }
        const correctUrl = `https://etherscan.io/address/${event.currentTarget.dataset.address}`
        wrapper.find('Button').first().simulate('click', event)
        expect(mockOpenUrl).toHaveBeenCalledWith(correctUrl)
    })

    it('should not call helper.openUrl when "View account on Etherscan" is clicked if no address is defined', () => {
        const wrapper = shallowWithIntl(<WalletHeader/>)
        wrapper.find('Button').first().simulate('click', {
            currentTarget: {
                dataset: {address: void(0)}
            }
        })
        expect(mockOpenUrl).not.toHaveBeenCalled()
    })
})