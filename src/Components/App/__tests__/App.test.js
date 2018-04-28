import React from 'react'
import { shallowWithIntl } from 'enzyme-react-intl'
import App from '../App'

describe('Components/App', function() {
    it('should render without throwing an error', function() {
        const wrapper = shallowWithIntl(<App />)
        // TODO: flesh out
    })
})
