import React from 'react'

import AddressCounter from '../AddressCounter'
import { shallowWithIntl } from '../../../i18n/enzymeHelper'

//TODO: Fix unit tests for better working with i18n
describe.skip('Components/Dashboard/AddressCounter', function() {
    it('should render without throwing an error', function () {
        expect(shallowWithIntl(<AddressCounter/>).find('.hidden-md-down').length).toBe(1)
    })
})