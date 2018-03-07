import React from 'react'
import { shallow } from 'enzyme'

import Dashboard from '../Dashboard'

describe('Components/Dashboard/Dashboard', function() {
    it('should render without throwing an error', function () {
        expect(shallow(<Dashboard/>).find('.dashboard').length).toBe(1)
    })
})