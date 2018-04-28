import React from 'react'
import { shallowWithIntl } from '../../../i18n/enzymeHelper'

import ActionsPanel from '../ActionsPanel'

//TODO: Fix unit tests for better working with i18n
describe.skip('Components/Send/ActionsPanel', function () {
    it('should render without throwing an error', function () {
        const wrapper = shallowWithIntl(<ActionsPanel/>);
        expect(wrapper.find('.actions-panel').length).toBe(1)
    })
})