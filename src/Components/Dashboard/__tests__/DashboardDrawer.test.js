import React from 'react'
import DashboardDrawer from '../DashboardDrawer'
import { shallowWithIntl } from '../../../i18n/enzymeHelper'

//TODO: Fix unit tests for better working with i18n
describe.skip('Components/Dashboard/DashboardDrawer', function() {
    it('should render without throwing an error', function () {
        const wrapper = shallowWithIntl(<DashboardDrawer/>)
        expect(wrapper.find('List').length).toBe(1)
    })
})