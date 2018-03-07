import React from 'react'
import {shallow} from 'enzyme'

// import ConfirmedTransactionListItem from '../ConfirmedTransactionListItem'
//TODO: fix import / constructor issue:
/*TypeError: Cannot read property 'from' of undefined

      79 |         let stateMachine
      80 |         if (
    > 81 |             transaction.from === walletAddress &&
      82 |             transaction.to !== walletAddress
      83 |         ) {
      84 |             stateMachine = 'SENT'

* */
describe.skip('Components/Wallet/ConfirmedTransactionListItem', function () {
    it('should render without throwing an error', function () {
        const wrapper = shallow(<ConfirmedTransactionListItem/>)
        expect(wrapper.find('.tx').length).toBe(1)
    })
})
