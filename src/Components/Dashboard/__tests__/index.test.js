let wrapper
describe('Components/Dashboard/index', function () {
    beforeEach(() => {
        wrapper = require('../index').default
    })
    it('should export Dashboard.jsx', function () {
        expect(wrapper).toBe(require('../Dashboard').default)
    })
})