let wrapper

describe.skip('Components/ContractHelper', function() {
    beforeEach(() => {
        wrapper = require('../ContractHelper')
    })
    it('should export ContractHelper object', function() {
        expect(wrapper).toBeTruthy()
    })
})
