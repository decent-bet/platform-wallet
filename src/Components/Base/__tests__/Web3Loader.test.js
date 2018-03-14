let wrapper
describe.skip('Components/Base/Web3Loader', function() {
    beforeEach(() => {
        wrapper = require('../Web3Loader')
    })
    it('should export Web3Loader default object', function() {
        console.log('wrapper: ' + wrapper.toString())

        expect(wrapper).toBeTruthy()
    })
})
