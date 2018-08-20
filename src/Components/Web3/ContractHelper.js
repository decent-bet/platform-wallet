import { fromEvent, Observable } from 'rxjs'

import DBETToVETDepositContract from './Contracts/DBETToVETDepositContract'
import DBETV1TokenMockContract from './Contracts/DBETV1TokenMockContract'
import DBETV2TokenMockContract from './Contracts/DBETV2TokenMockContract'

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

    }

    fromEmitter(emitter) {
        return Observable.create(observer => {
            emitter.on('data', i => observer.next(i))
            emitter.on('error', e => observer.error(e))
        })
    }

    getPendingTransactions$() {
        this.listener = this.web3.eth.subscribe('pendingTransactions', () => {})
        return this.fromEmitter(this.listener)
    }

    logs$() {
        this.listener = this.web3.eth.subscribe('logs', {
            address: this.web3.eth.defaultAccount,
            topics: [this.web3.eth.defaultAccount],
        }, () => {})
        return this.fromEmitter(this.listener)
    }

    syncing$() {
        this.listener = this.web3.eth.subscribe('syncing', () => {})
        return this.fromEmitter(this.listener)
    }

    newBlockHeaders$() {
        this.listener = this.web3.eth.subscribe('newBlockHeaders', () => {})
        return this.fromEmitter(this.listener)
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
