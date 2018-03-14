import ReactDOM from 'react-dom'
jest.mock('react-dom')

describe.skip('Index', function() {
    let wrapper
    beforeEach(() => {
        ReactDOM.render = jest.fn()
        wrapper = require('../index')
    })

    it('should render without throwing an error', function() {
        const r = new ReactDOM()
        expect(r.render).toHaveBeenCalled()
    })
})
