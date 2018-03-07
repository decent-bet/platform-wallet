import React from 'react'
import {shallow} from 'enzyme'

import NextDialog from '../NextDialog'

describe('Components/NewWallet/Dialogs/NextDialog', function () {
    it('should render without throwing an error', function () {
        const wrapper = shallow(<NextDialog open={true}/>)
        expect(wrapper.find('.passphrase-confirmation').length).toBe(1)
    })
})