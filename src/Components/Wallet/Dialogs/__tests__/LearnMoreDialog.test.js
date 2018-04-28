import React from 'react'
import { shallowWithIntl } from '../../../../i18n/enzymeHelper'

import LearnMoreDialog from '../LearnMoreDialog'

describe('Components/Wallet/Dialogs/LearnMoreDialog', function () {
    it('should render without throwing an error', function () {
        const wrapper = shallowWithIntl(LearnMoreDialog({isOpen: true}))
    })
})