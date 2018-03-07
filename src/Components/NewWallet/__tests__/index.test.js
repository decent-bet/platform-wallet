let wrapper
describe('Components/NewWallet/index', function () {
    beforeEach(() => {
        wrapper = require('../index').default
    })
    it('should export NewWallet.jsx', function () {
        expect(wrapper).toBe(require('../NewWallet').default)
    })
})