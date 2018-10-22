import React from 'react'
import Adapter from 'enzyme-adapter-react-16'
import Login from './Login.jsx'
import { mountWithIntl } from '../../i18n/enzymeHelper'
import { configure } from 'enzyme'

import { library } from '@fortawesome/fontawesome-svg-core'
import faSolid from '@fortawesome/fontawesome-free-solid'
import { faEthereum } from '@fortawesome/fontawesome-free-brands'

beforeAll(() => {
    library.add(faSolid, faEthereum)
    configure({ adapter: new Adapter() })
})

const MOCK_PASSWORD_1 = 'correct_password'
const MOCK_PASSWORD_2 = 'evil_password'
const MOCK_MNEMONIC = 'This is a false Mnemonic'

describe('<Login />', () => {
    let wrapper
    let password1
    let password2

    beforeEach(async () => {
        wrapper = mountWithIntl(<Login />)
        password1 = wrapper.find('#passwordInputId input').first()
        password2 = wrapper.find('#passwordConfirmationInputId input').first()

        // Setup the Mnemonic.
        const query = 'textarea#passphraseInput' // `textarea` because `multiline=true`
        const mnemonicField = wrapper.find(query)
        mnemonicField.simulate('change', { target: { value: MOCK_MNEMONIC } })
    })

    test('Mnemonic must have been recorded', async () => {
        const form = wrapper.children().first()
        expect(form.state('mnemonic')).toBe(MOCK_MNEMONIC)
    })

    test('Must be enabled if both passwords match', async () => {
        // Control value
        const loginButton = wrapper.find('#loginButton').first()
        expect(loginButton.prop('disabled')).toBeTruthy()

        // Update props
        password1.simulate('change', { target: { value: MOCK_PASSWORD_1 } })
        password2.simulate('change', { target: { value: MOCK_PASSWORD_1 } })

        // Test updated props
        const loginButton2 = wrapper.find('#loginButton').first()
        const form = wrapper.children().first()
        expect(loginButton2.prop('disabled')).toBeFalsy()
        expect(form.state().password).toBe(MOCK_PASSWORD_1)
    })

    test('Must be disabled if passwords do not match', async () => {
        // Control Value
        const loginButton = wrapper.find('#loginButton').first()
        expect(loginButton.prop('disabled')).toBeTruthy()

        // Update props
        password1.simulate('change', { target: { value: MOCK_PASSWORD_1 } })
        password2.simulate('change', { target: { value: MOCK_PASSWORD_2 } })

        // Test updated props
        const loginButton2 = wrapper.find('#loginButton').first()
        const form = wrapper.children().first()
        expect(loginButton2.prop('disabled')).toBeTruthy()
        expect(form.state().confirmPassword).toBe(MOCK_PASSWORD_2)
    })
})
