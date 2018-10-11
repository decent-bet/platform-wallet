let wrapper
describe('Components/Constants', function () {
    beforeEach(() => {
        wrapper = require('../Constants')
    })
    it('should define TOKEN_BALANCE_LOADING', function () { // chosen to test as it was the last defined constant
        expect(wrapper.TOKEN_BALANCE_LOADING).toBeTruthy() // proving evaluation of others
    })
})