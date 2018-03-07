import React from 'react'
import { shallow } from 'enzyme'

import EtherBalanceCounter from '../EtherBalanceCounter'

describe('Components/Dashboard/EtherBalanceCounter', function() {
    it('should render without throwing an error', function () {
        expect(shallow(<EtherBalanceCounter/>).find('.address-label').length).toBe(1)
    })
})