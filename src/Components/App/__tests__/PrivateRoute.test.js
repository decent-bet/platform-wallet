// TODO: fix Cannot find module './build/Release/scrypt' from 'index.js'

let wrapper
describe.skip('Components/App/PrivateRoute', function () {
    beforeEach(() => {
        wrapper = require('../PrivateRoute').default
    })
    it('should export function', function () {
        expect(wrapper).toBeInstanceOf(Function)
    })
})