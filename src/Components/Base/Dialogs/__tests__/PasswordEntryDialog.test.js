import React from 'react'
import { shallow } from 'enzyme'

import PasswordEntryDialog from '../PasswordEntryDialog'

describe('Components/Base/Dialogs/PasswordEntryDialog', function() {
    it('should render without throwing an error', function () {
        expect(shallow(<PasswordEntryDialog/>).find('TextField').length).toBe(1)
    })
})