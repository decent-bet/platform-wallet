let module
describe('src/Model/house/actions', function() {
    beforeEach(() => {
        module = require('../actions')
    })
    it('should export required functions', function() {
        expect(module.fetchCurrentSessionId).toBeInstanceOf(Function)
        expect(module.default.house.approveAndPurchaseHouseCredits).toBeInstanceOf(Function)
        expect(module.default.house.approveAndPurchaseHouseCredits).toBeInstanceOf(Function)
        expect(module.default.house.getHouseAllowance).toBeInstanceOf(Function)
        expect(module.default.house.getHouseAuthorizedAddresses).toBeInstanceOf(Function)
        expect(module.default.house.getHouseSessionData).toBeInstanceOf(Function)
        expect(module.default.house.getHouseSessionId).toBeInstanceOf(Function)
        expect(module.default.house.purchaseHouseCredits).toBeInstanceOf(Function)
    })
})
