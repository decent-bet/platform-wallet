describe('src/Model/house/actionTypes', function() {
    beforeEach(() => {
        module = require('../actionTypes')
    })

    it('should export required functions', function() {
        expect(module.default).toBeInstanceOf(Object)
    })
})
