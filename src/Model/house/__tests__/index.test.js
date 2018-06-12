import { fetchCurrentSessionId } from '../actions'

const Helper = require('../../../Components/Helper').default
let module
let helper
jest.mock('../../../Components/Helper')
jest.mock('../actions')

describe('src/Model/house/index', function() {
    beforeEach(() => {
        module = require('../index')
        helper = new Helper()
    })
    it('should export required functions', function() {
        expect(module.initWatchers).toBeInstanceOf(Function)
        expect(module.stopWatchers).toBeInstanceOf(Function)
    })
    it('should init watchers when initWatchers called', function() {
        const mockDispatch = jest.fn()
        module.initWatchers(mockDispatch)
        expect(fetchCurrentSessionId).toHaveBeenCalled()
        // expect(Helper.getContractHelper).toHaveBeenCalled()
        // expect(Helper
        //     .getContractHelper()
        //     .getWrappers()
        //     .house()
        //     .logPurchasedCredits()).toHaveBeenCalled()
        //TODO: add Watch()
        // expect()
    })
    it('should stop watchers when stopWatchers called', function() {
        module.stopWatchers()
        // expect(helper
        //     .getContractHelper()
        //     .getWrappers()
        //     .house()
        //     .logPurchasedCredits()
        //     .stopWatching).toHaveBeenCalled()
    })
})
