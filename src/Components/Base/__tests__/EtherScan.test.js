let wrapper
describe('Components/Base/EtherScan', function () {
    beforeEach(() => {
        wrapper = require('../EtherScan').default
    })
    it('should export EtherScan', function () {
        expect(wrapper).toBeTruthy()
    })
})