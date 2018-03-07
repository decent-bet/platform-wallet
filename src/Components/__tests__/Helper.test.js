let wrapper
describe('Components/Helper', function () {
    beforeEach(() => {
        wrapper = require('../Helper').default
    })
    it('should export Helper object', function () {
        expect(wrapper).toBeTruthy()
    })
})