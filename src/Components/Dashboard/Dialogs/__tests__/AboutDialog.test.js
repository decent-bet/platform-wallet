import {shallow} from 'enzyme'

import AboutDialog from '../AboutDialog'

describe.skip('Components/Dashboard/Dialogs/AboutDialog', function () {
    it('should render without throwing an error', function () {
        const wrapper = shallow(AboutDialog({isShown: true}))
        // TODO: flesh out
        //TODO: Warning: Failed context type: The context `muiTheme` is marked as required in `Dialog`, but its value is `undefined`.
    })
})