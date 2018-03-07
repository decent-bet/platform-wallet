import React from 'react'
import {shallow} from 'enzyme'
import Helper, {mockOpenUrl} from '../../Helper'

jest.mock('../../Helper')
import PendingTransactionListItem from '../PendingTransactionListItem'

describe('Components/Wallet/PendingTransactionListItem', function () {
    it('should render without throwing an error', function () {
        const wrapper = shallow(<PendingTransactionListItem transaction={{hash: '', to: '', from: ''}}/>)
        expect(wrapper.find('.tx').length).toBe(1)
    })
    it('should call helper.openUrl when hash is clicked', function () {
        const correctHash = "0xF00"
        const wrapper = shallow(<PendingTransactionListItem transaction={{hash: correctHash, to: '', from: ''}}/>)
        wrapper.find('.hash').first().simulate('click')
        expect(mockOpenUrl).toHaveBeenCalledWith(`https://etherscan.io/tx/${correctHash}`)
    })
})
