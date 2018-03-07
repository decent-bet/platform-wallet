let wrapper
describe('Components/Base/PendingTxHandler', function () {
    beforeEach(() => {
        wrapper = require('../PendingTxHandler').default
    })
    it('should export PendingTxHandler', function () {
        expect(wrapper).toBeTruthy()
    })
})