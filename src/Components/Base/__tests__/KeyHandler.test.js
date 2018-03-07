let wrapper
describe('Components/Base/KeyHandler', function () {
    beforeEach(() => {
        wrapper = require('../KeyHandler').default
    })
    it('should export KeyHandler', function () {
        expect(wrapper).toBeTruthy()
    })
})