import React from 'react'
import {shallow} from 'enzyme'

import Send from '../Send'

describe('Components/Send/Send', function () {
    it('should render without throwing an error', function () {
        const wrapper = shallow(<Send/>);
        expect(wrapper.find('.send').length).toBe(1)
    })
})