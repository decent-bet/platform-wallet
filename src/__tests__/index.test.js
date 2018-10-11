import ReactDOM from 'react-dom'
import fontAwesome from '@fortawesome/fontawesome'
jest.mock('react-dom')
jest.mock('@fortawesome/fontawesome')

describe('index', function() {
    let module
    beforeEach(() => {
        module = require('../index')
    })

    it('should render without throwing an error', function() {
        expect(ReactDOM.render).toHaveBeenCalled()
    })

    it('should have called fontAwesome.library.add', function() {
        expect(fontAwesome.library.add).toHaveBeenCalled()
    })
})
