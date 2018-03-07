import React from 'react'
import { shallow } from 'enzyme'

import NewWallet from '../NewWallet'

describe('Components/NewWallet/NewWallet', function() {
    it('should render without throwing an error', function () {
        expect(shallow(<NewWallet/>).find('.new-wallet').length).toBe(1)
    })
})