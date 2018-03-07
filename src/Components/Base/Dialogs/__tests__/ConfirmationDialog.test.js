import React from 'react'
import { shallow } from 'enzyme'

import ConfirmationDialog from '../ConfirmationDialog'

describe('Components/Base/Dialogs/ConfirmationDialog', function() {
    it('should render without throwing an error', function () {
        expect(shallow(<ConfirmationDialog/>).find('Dialog').length).toBe(1)
    })
})