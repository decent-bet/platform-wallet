import React from 'react'
import {shallow} from 'enzyme'

import KeyboardKeyList from '../KeyboardKeyList'

describe('Components/Send/KeyboardKeyList', function () {
    it('should render without throwing an error', function () {
        const wrapper = shallow(<KeyboardKeyList/>);
        expect(wrapper.find('.key-left').length).toBe(1)
    })
})