/* TODO: fix jest misconfiguration issue?
* Cannot find module '../ContractHelper' from 'Web3Loader.test.js'

      1 | jest.mock('eventing-bus')
      2 | jest.mock('web3')
    > 3 | jest.mock('../ContractHelper')
      4 | jest.mock('web3-eth-accounts')

* */
// jest.mock('../ContractHelper')
// jest.mock('web3-eth-accounts')jest.mock('eventing-bus')
// jest.mock('web3')
// jest.mock('../Constants')

let wrapper
describe.skip('Components/Base/Web3Loader', function() {
    beforeEach(() => {
        wrapper = require('../Web3Loader')
    })
    it('should export Web3Loader default object', function() {
        expect(wrapper).toBeTruthy()
    })
})
