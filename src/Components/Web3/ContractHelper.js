import { fromEvent, Observable } from 'rxjs'

import DBETToVETDepositContract from './Contracts/DBETToVETDepositContract'
import DBETV1TokenMockContract from './Contracts/DBETV1TokenMockContract'
import DBETV2TokenMockContract from './Contracts/DBETV2TokenMockContract'
import DBETVETTokenContract from './Contracts/DBETVETTokenContract.js'
export default class ContractHelper {
    /**
     *
     * @param {Web3} web3Param
     */
    constructor(web3Param, thor) {
        this.web3 = web3Param

        // Initialize new Contracts
        this.v1TokenContract = new DBETV1TokenMockContract(this.web3)
        this.v2TokenContract = new DBETV2TokenMockContract(this.web3)
        this.depositContract = new DBETToVETDepositContract(this.web3, thor)
        this.vetContract = new DBETVETTokenContract(this.web3, thor)

    }

    fromEmitter(emitter) {
        return Observable.create(observer => {
            emitter.on('data', i => observer.next(i))
            emitter.on('error', e => observer.error(e))
        })
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

    get VETToken() {
        return this.vetContract
    }
}
