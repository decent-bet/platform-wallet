import React from 'react'

import PasswordEntryDialog from '../PasswordEntryDialog'
import { shallowWithIntl } from '../../../../i18n/enzymeHelper'

//TODO: Fix unit tests for better working with i18n
describe.skip('Components/Base/Dialogs/PasswordEntryDialog', function() {
    it('should render without throwing an error', function () {
        expect(shallowWithIntl(<PasswordEntryDialog/>).find('TextField').length).toBe(1)
    })
})