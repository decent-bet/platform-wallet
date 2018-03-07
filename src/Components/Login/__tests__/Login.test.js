import React from 'react'
import { shallow } from 'enzyme'

import Login from '../Login'

describe('Components/Login/Login', function() {
    it('should render without throwing an error', function () {
        expect(shallow(<Login/>).find('.login').length).toBe(1)
    })
})