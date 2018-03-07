let wrapper
/* TODO: Fix resolver for scrypt module
Cannot find module './build/Release/scrypt' from 'index.js'
      at Resolver.resolveModule (node_modules/jest-resolve/build/index.js:169:17)
      at Object.<anonymous> (node_modules/scrypt/index.js:3:20)
* */
describe.skip('Components/ContractHelper', function () {
    beforeEach(() => {
        wrapper = require('../ContractHelper')
    })
    it('should export ContractHelper object', function () {
        expect(wrapper).toBeTruthy()
    })
})