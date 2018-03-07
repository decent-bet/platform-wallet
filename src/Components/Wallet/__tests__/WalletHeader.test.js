import React from 'react'
import {shallow} from 'enzyme'
import Helper, {mockOpenUrl} from '../../Helper'
import WalletHeader from '../WalletHeader'

jest.mock('../../Helper')

describe('Components/Wallet/Wallet', function () {
    beforeEach(() => {
        // Clear all instances and calls to constructor and all methods:
        Helper.mockClear()
        mockOpenUrl.mockClear()
    })

    it('should render without throwing an error', function () {
        const wrapper = shallow(<WalletHeader/>)
        expect(wrapper.find('.wallet-header').length).toBe(1)
    })

    it('should call helper.openUrl when "View account on Etherscan" is clicked', () => {
        const wrapper = shallow(<WalletHeader/>)
        const event = {
            currentTarget: {
                dataset: {address: '0xF00'}
            }
        }
        const correctUrl = `https://etherscan.io/address/${event.currentTarget.dataset.address}`
        wrapper.find('FlatButton').first().simulate('click', event)
        expect(mockOpenUrl).toHaveBeenCalledWith(correctUrl)
    })

    it('should not call helper.openUrl when "View account on Etherscan" is clicked if no address is defined', () => {
        const wrapper = shallow(<WalletHeader/>)
        wrapper.find('FlatButton').first().simulate('click', {
            currentTarget: {
                dataset: {address: void(0)}
            }
        })
        expect(mockOpenUrl).not.toHaveBeenCalled()
    })
})