import React from 'react'

import Dashboard from '../Dashboard'
import { shallowWithIntl } from '../../../i18n/enzymeHelper'

//TODO: Fix unit tests for better working with i18n
describe.skip('Components/Dashboard/Dashboard', function() {
    it('should render without throwing an error', function () {
        expect(shallowWithIntl(<Dashboard/>).find('.dashboard').length).toBe(1)
    })
})