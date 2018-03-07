import React from 'react'
import {shallow} from 'enzyme'

import LearnMoreDialog from '../LearnMoreDialog'

describe('Components/Wallet/Dialogs/LearnMoreDialog', function () {
    it('should render without throwing an error', function () {
        const wrapper = shallow(LearnMoreDialog({isOpen: true}))
    })
})