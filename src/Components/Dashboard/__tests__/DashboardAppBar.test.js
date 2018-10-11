import React from 'react'
import { shallow } from 'enzyme'

import DashboardAppBar from '../DashboardAppBar'

describe('Components/Dashboard/DashboardAppBar', function() {
    it('should render without throwing an error', function () {
        expect(shallow(<DashboardAppBar/>).find('.appbar').length).toBe(1)
    })
})