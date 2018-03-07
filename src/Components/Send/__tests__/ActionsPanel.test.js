import React from 'react'
import {shallow} from 'enzyme'

import ActionsPanel from '../ActionsPanel'

describe('Components/Send/ActionsPanel', function () {
    it('should render without throwing an error', function () {
        const wrapper = shallow(<ActionsPanel/>);
        expect(wrapper.find('.actions-panel').length).toBe(1)
    })
})