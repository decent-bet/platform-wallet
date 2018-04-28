import React from 'react'
import { shallowWithIntl } from '../../../../i18n/enzymeHelper'

import TransferConfirmationDialog from '../TransferConfirmationDialog'

describe('Components/Send/Dialogs/TransferConfirmationDialog', function () {
    it('should render without throwing an error', function () {
        const wrapper = shallowWithIntl(<TransferConfirmationDialog open={true}/>)
        expect(wrapper.find('.transfer-confirmation-dialog').length).toBe(1)
    })
})