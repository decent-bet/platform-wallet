// TODO: fix Cannot find module './build/Release/scrypt' from 'index.js'

let module
describe.skip('Components/App/PrivateRoute', function () {
    beforeEach(() => {
        module = require('../PrivateRoute').default
    })
    it('should export function', function () {
        expect(module).toBeInstanceOf(Function)
    })
})