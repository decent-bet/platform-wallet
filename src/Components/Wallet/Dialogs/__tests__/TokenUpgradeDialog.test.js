import React from 'react'
// import { shallowWithIntl } from '../../../../i18n/enzymeHelper'

//import LearnMoreDialog from '../LearnMoreDialog'
// TODO: fix rendering problems caused by constructor
describe.skip('Components/Wallet/Dialogs/LearnMoreDialog', function () {
    it('should render without throwing an error', function () {
        const wrapper = shallowWithIntl(LearnMoreDialog({isOpen: true}))
    })
})

let wrapper
describe('Components/Wallet/Dialogs/LearnMoreDialog', function () {
    beforeEach(() => {
        wrapper = require('../LearnMoreDialog').default
    })
    it('should export function', function () {
        expect(wrapper).toBeInstanceOf(Function)
    })
})