import React from 'react'
import { shallow } from 'enzyme'

import DashboardDrawerHeader from '../DashboardDrawerHeader'

describe('Components/Dashboard/DashboardDrawerHeader', function() {
    it('should render without throwing an error', function () {
        expect(shallow(<DashboardDrawerHeader/>).find('.drawer').length).toBe(1)
    })
})