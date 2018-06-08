let module
doMock('../../Components/Helper')
describe('src/Model/house/index', function() {
    beforeEach(() => {
        module = require('../index')
    })
    it('should export required functions', function() {
        expect(module.initWatchers).toBeInstanceOf(Function)
        expect(module.stopWatchers).toBeInstanceOf(Function)
    })
    it('should init watchers when initWatchers called', function() {
         module.initWatchers()
         expect(module.initWatchers()).toBeCalled()
        // expect()
    })
    // it('should stop watchers when stopWatchers called', function() {
    //     // initWatchers
    // })
})
