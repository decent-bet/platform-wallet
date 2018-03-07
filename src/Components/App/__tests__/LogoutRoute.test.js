let wrapper
describe('Components/App/LogoutRoute', function () {
    beforeEach(() => {
        wrapper = require('../LogoutRoute').default
    })
    it('should export function', function () {
        expect(wrapper).toBeInstanceOf(Function)
    })
})