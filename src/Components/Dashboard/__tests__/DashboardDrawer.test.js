import React from 'react'
import { shallow } from 'enzyme'

import DashboardDrawer from '../DashboardDrawer'

describe('Components/Dashboard/DashboardDrawer', function() {
    it('should render without throwing an error', function () {
        const wrapper = shallow(<DashboardDrawer/>)
        expect(wrapper.find('List').length).toBe(1)
    })
})