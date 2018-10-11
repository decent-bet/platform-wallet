let module
describe('Components/App/PrivateRoute', function() {
    beforeEach(() => {
        module = require('../PrivateRoute').default
    })
    it('should export function', function() {
        expect(module).toBeInstanceOf(Function)
    })
})
