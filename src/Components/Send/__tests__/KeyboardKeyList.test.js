import React from 'react'
import { shallowWithIntl } from '../../../i18n/enzymeHelper'

import KeyboardKeyList from '../KeyboardKeyList'

describe('Components/Send/KeyboardKeyList', function () {
    it('should render without throwing an error', function () {
        const wrapper = shallowWithIntl(<KeyboardKeyList/>);
        expect(wrapper.find('.key-left').length).toBe(1)
    })
})