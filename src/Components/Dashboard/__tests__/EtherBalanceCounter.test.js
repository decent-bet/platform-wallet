import React from 'react'

import EtherBalanceCounter from '../EtherBalanceCounter'
import { shallowWithIntl } from '../../../i18n/enzymeHelper'

//TODO: Fix unit tests for better working with i18n
describe.skip('Components/Dashboard/EtherBalanceCounter', function() {
    it('should render without throwing an error', function () {
        expect(shallowWithIntl(<EtherBalanceCounter/>).find('.address-label').length).toBe(1)
    })
})