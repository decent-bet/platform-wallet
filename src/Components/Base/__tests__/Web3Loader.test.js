let wrapper
/* TODO: fix scrypt resolution
Cannot find module './build/Release/scrypt' from 'index.js'

      at Resolver.resolveModule (node_modules/jest-resolve/build/index.js:169:17)
      at Object.<anonymous> (node_modules/scrypt/index.js:3:20)
* */
describe.skip('Components/Base/Web3Loader', function () {
    beforeEach(() => {
        wrapper = require('../Web3Loader')
    })
    it('should export Web3Loader default object', function () {
        console.log('wrapper: ' + wrapper.toString())

        expect(wrapper).toBeTruthy()
    })
})