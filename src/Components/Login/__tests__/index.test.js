let wrapper
describe('Components/Login/index', function () {
    beforeEach(() => {
        wrapper = require('../index').default
    })
    it('should export Login.jsx', function () {
        expect(wrapper).toBe(require('../Login').default)
    })
})