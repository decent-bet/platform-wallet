import web3 from 'web3'
import BaseContract from './BaseContract'
import Etherscan from '../../Base/EtherScan'

jest.mock('../../Base/EtherScan')

beforeEach(() => {
    (Etherscan as any).mockClear()
})

describe('BaseContract', () => {
    let Web3
    beforeEach(() => {
        Web3 = new web3()
    })
    it('when creating instance, should return new BaseContract', () => {
        const contract = new BaseContract(Web3)
        expect(contract).toBeTruthy()
        expect(Etherscan).toHaveBeenCalled()
    })
})