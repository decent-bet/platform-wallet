import React from 'react'
import {shallow} from 'enzyme'

import TransferConfirmationDialog from '../TransferConfirmationDialog'

describe('Components/Send/Dialogs/TransferConfirmationDialog', function () {
    it('should render without throwing an error', function () {
        const wrapper = shallow(<TransferConfirmationDialog open={true}/>)
        expect(wrapper.find('.transfer-confirmation-dialog').length).toBe(1)
    })
})