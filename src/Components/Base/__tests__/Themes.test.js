let wrapper
describe('Components/Base/Themes', function () {
    beforeEach(() => {
        wrapper = require('../Themes').default
    })
    it('should export Themes default object', function () {
        expect(wrapper).toBeTruthy()
    })
})