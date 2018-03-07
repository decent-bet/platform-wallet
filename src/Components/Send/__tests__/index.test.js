let wrapper
describe('Components/Send/index', function () {
    beforeEach(() => {
        wrapper = require('../index').default
    })
    it('should export Send.jsx', function () {
        expect(wrapper).toBe(require('../Send').default)
    })
})