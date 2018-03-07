import React from 'react'
import {shallow} from 'enzyme'

//import LearnMoreDialog from '../LearnMoreDialog'
// TODO: fix rendering problems caused by constructor
describe.skip('Components/Wallet/Dialogs/LearnMoreDialog', function () {
    it('should render without throwing an error', function () {
        const wrapper = shallow(LearnMoreDialog({isOpen: true}))
    })
})