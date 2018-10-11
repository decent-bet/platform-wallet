let wrapper
describe('Components/App/index', function() {
    beforeEach(() => {
        wrapper = require('../index').default
    })
    it('should export App.jsx', function() {
        expect(wrapper).toBe(require('../App').default)
    })
})
