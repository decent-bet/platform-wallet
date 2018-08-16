import { from, fromEvent } from 'rxjs'

import DBETToVETDepositContract from './Contracts/DBETToVETDepositContract'
import DBETV1TokenMockContract from './Contracts/DBETV1TokenMockContract'
import DBETV2TokenMockContract from './Contracts/DBETV2TokenMockContract'

export default class ContractHelper {
    /**
     *
     * @param {Web3} web3Param
     */
    constructor(web3Param) {
        this.web3 = web3Param

        // Initialize new Contracts
        this.depositContract = new DBETToVETDepositContract(this.web3)
        this.v1TokenContract = new DBETV1TokenMockContract(this.web3)
        this.v2TokenContract = new DBETV2TokenMockContract(this.web3)
    }

    subscribe$() {
        this.listener = this.web3.eth.subscribe('pendingTransactions', () => {
            debugger
        })
        this.listener.on('data', i => {
            console.log(i)
        })
        return fromEvent(this.listener)
    }

    get V1Token() {
        return this.v1TokenContract
    }

    get V2Token() {
        return this.v2TokenContract
    }

    get DepositToVET() {
        return this.depositContract
    }
}
