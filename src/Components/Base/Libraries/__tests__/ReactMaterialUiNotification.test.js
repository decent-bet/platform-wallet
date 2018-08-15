import React from 'react'
import { shallow } from 'enzyme'

jest.mock('prop-types')
jest.mock('material-ui/utils/propTypes')
jest.mock('react-transition-group', () => {
    <div></div>
})

jest.mock('material-ui/Paper')
jest.mock('material-ui/List')
jest.mock('material-ui/Divider')
jest.mock('material-ui/IconButton')
jest.mock('material-ui/Avatar')
jest.mock('material-ui/svg-icons/navigation/close')

import ReactMaterialUiNotifications from '../ReactMaterialUiNotifications'

describe('Components/Libraries/ReactMaterialUiNotifications', function() {
    it('should render without throwing an error', function() {
        const wrapper = shallow(<ReactMaterialUiNotifications/>)
    })
    it('should render without throwing an error when calling showNotification', function() {
        ReactMaterialUiNotifications.shuffleNotifications = jest.fn()
        ReactMaterialUiNotifications.showNotification([{}])
        expect(ReactMaterialUiNotifications.shuffleNotifications).toBeCalled()
    })
    it('should allow calling clearNotification without throwing an error', function() {
        ReactMaterialUiNotifications.clearNotifications()
    })
    it('should render without throwing an error when calling shuffleNotifications', function() {
        const mockTempNotifications = [{
            priority: 1
        }]
        ReactMaterialUiNotifications.defaultProps.maxNotifications = 1
        ReactMaterialUiNotifications.shuffleNotifications(mockTempNotifications)
    })
})