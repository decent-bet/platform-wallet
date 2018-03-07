let wrapper
describe('Components/Base/styles', function () {
    beforeEach(() => {
        wrapper = require('../styles').styles
    })
    it('should export styles', function () {
        expect(wrapper).toBeTruthy()
    })
})