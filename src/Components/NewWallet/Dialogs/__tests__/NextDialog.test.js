import React from 'react'
import {shallow} from 'enzyme'

import NextDialog from '../NextDialog'

describe('Components/NewWallet/Dialogs/NextDialog', function () {
    it('should render without throwing an error', function () {
        const wrapper = shallow(<NextDialog open={true}/>)
        expect(wrapper.find('.passphrase-confirmation').length).toBe(1)
    })

    it('should handle Enter key on TextInput keypress', function () {
        const mockMnemonic = 'mock mnemonic'
        const mockPassword = "Password123"
        const keyPressEvent = {
            key: "Enter",
            preventDefault: jest.fn()
        }
        const mockOnNext = jest.fn()
        const wrapper = shallow(<NextDialog open={true} onNext={mockOnNext} mnemonic={mockMnemonic}/>)
        wrapper.find('TextField[type="text"]').first().simulate('change', null, mockMnemonic)
        wrapper.find('TextField[type="password"]').first().simulate('change', null, mockPassword)
        wrapper.find('TextField[type="password"]').last().simulate('change', null, mockPassword)
        wrapper.find('TextField').first().simulate('keyPress', keyPressEvent)
        expect(keyPressEvent.preventDefault).toBeCalled()
        expect(mockOnNext).toBeCalled()
    })
})