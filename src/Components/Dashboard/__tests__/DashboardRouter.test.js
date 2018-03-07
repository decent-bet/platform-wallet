import React from 'react'
import { shallow } from 'enzyme'

import DashboardRouter from '../DashboardRouter'

describe('Components/Dashboard/DashboardRouter', function() {
    it('should render without throwing an error', function () {
        const wrapper = shallow(<DashboardRouter/>)
        expect(wrapper.find('Switch').length).toBe(1)
    })
})