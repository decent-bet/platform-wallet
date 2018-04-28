import React from 'react'
import { shallowWithIntl } from '../../../i18n/enzymeHelper'

import Send from '../Send'

//TODO: Fix unit tests for better working with i18n
describe.skip('Components/Send/Send', function () {
    it('should render without throwing an error', function () {
        const wrapper = shallowWithIntl(<Send/>);
        expect(wrapper.find('.send').length).toBe(1)
    })
})