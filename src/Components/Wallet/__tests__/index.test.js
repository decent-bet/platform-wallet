let wrapper
describe('Components/Wallet/index', function () {
    beforeEach(() => {
        wrapper = require('../index').default
    })
    it('should export Wallet.jsx', function () {
        expect(wrapper).toBe(require('../Wallet').default)
    })
})