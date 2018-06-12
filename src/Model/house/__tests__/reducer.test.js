describe('src/Model/house/reducer', function() {
    beforeEach(() => {
        module = require('../reducer')
    })

    it('should export required functions', function() {
        expect(module.default).toBeInstanceOf(Function)
    })
})
