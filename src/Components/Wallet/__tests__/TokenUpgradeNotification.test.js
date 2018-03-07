import React from 'react'
import {mockFormatDbets} from '../../Helper'

const TokenUpgradeNotification = require('../TokenUpgradeNotification').default

jest.mock('../../Helper')

describe('/Components/Wallet/TokenUpgradeNotification', function () {
    it('should render without throwing an error', function () {
        let oldTokenBalance = 0
        expect(TokenUpgradeNotification).toBeInstanceOf(Function)
        TokenUpgradeNotification(oldTokenBalance)
        expect(mockFormatDbets).toBeCalled()
    })
})