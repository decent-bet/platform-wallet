import React from 'react'
import { shallow } from 'enzyme'

import AddressCounter from '../AddressCounter'

describe('Components/Dashboard/AddressCounter', function() {
    it('should render without throwing an error', function () {
        expect(shallow(<AddressCounter/>).find('.hidden-md-down').length).toBe(1)
    })
})