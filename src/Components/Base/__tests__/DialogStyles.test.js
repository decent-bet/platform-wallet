describe('Components/Base/DialogStyles', function () {
    it('should export styles as an object', function () {
        const wrapper = require('../DialogStyles')
        expect(wrapper.styles).toBeInstanceOf(Object)
    })
})