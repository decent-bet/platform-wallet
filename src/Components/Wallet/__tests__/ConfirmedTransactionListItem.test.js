import React from 'react'
import { shallowWithIntl } from '../../../i18n/enzymeHelper'
import ConfirmedTransactionListItem from '../ConfirmedTransactionListItem'

import {mockOpenUrl} from '../../Helper'

jest.mock('../../Helper')
//TODO: fix import / constructor issue:
/*TypeError: Cannot read property 'from' of undefined

      79 |         let stateMachine
      80 |         if (
    > 81 |             transaction.from === walletAddress &&
      82 |             transaction.to !== walletAddress
      83 |         ) {
      84 |             stateMachine = 'SENT'

* */
describe('Components/Wallet/ConfirmedTransactionListItem', function () {
    it('should handle "SENT" state', function () {
        const mockWalletAddress = "0xF001"
        const mockTransaction = {
            from: mockWalletAddress,
            to: "0xDEADBEEF",
            hash: "0xF00", block: {
                timestamp: 1520906156
            }
        }
        const wrapper = shallowWithIntl(<ConfirmedTransactionListItem transaction={mockTransaction}
                                                              walletAddress={mockWalletAddress}/>)
        expect(wrapper.find({stateMachine: 'SENT'}).length).toBeGreaterThan(0)
    })
    it('should handle "RECEIVED" state', function () {
        const mockWalletAddress = "0xF001"
        const mockTransaction = {
            to: mockWalletAddress,
            from: "0xDEADBEEF",
            hash: "0xF00", block: {
                timestamp: 1520906156
            }
        }
        const wrapper = shallowWithIntl(<ConfirmedTransactionListItem transaction={mockTransaction}
                                                              walletAddress={mockWalletAddress}/>)
        expect(wrapper.find({stateMachine: 'RECEIVED'}).length).toBeGreaterThan(0)
    })
    it('should handle "UPGRADED" state', function () {
        const mockWalletAddress = "0xF001"
        const mockTransaction = {
            hash: "0xF00", block: {
                timestamp: 1520906156
            }
        }
        const wrapper = shallowWithIntl(<ConfirmedTransactionListItem transaction={mockTransaction}
                                                              walletAddress={mockWalletAddress}/>)
        expect(wrapper.find({stateMachine: 'UPGRADED'}).length).toBeGreaterThan(0)
    })
    // TODO: fix script below, for some reason ItemContent is not registering the click,
    // perhaps because it was created from a function?
    it.skip('should call helper.openUrl when ItemContent is clicked', function () {
        const mockWalletAddress = "0xF001"
        const mockTransaction = {
            to: mockWalletAddress,
            from: "0xDEADBEEF",
            hash: "0xF00", block: {
                timestamp: 1520906156
            }
        }
        const wrapper = shallowWithIntl(<ConfirmedTransactionListItem transaction={mockTransaction}
                                                              walletAddress={mockWalletAddress}/>)
        expect(wrapper.find('ItemContent').length).toBe(1)
        wrapper.find('ItemContent').simulate('click')
        expect(mockOpenUrl).toHaveBeenCalledWith(`https://etherscan.io/tx/${mockTransaction.hash}`)
    })
})
