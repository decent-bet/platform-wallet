import React from 'react'
import {shallow} from 'enzyme'

import Keyboard from '../Keyboard'

describe('Components/Send/Keyboard', function () {
    it('should render without throwing an error', function () {
        const wrapper = shallow(<Keyboard/>);
        expect(wrapper.find('.keyboard').length).toBe(1)
    })
})