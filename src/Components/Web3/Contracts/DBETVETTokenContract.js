import BaseContract from './BaseContract'
const Contract_DBETVETToken = require('../../Base/Contracts/DBETVETToken.json')
import {  DBET_VET_TOKEN_ADDRESS } from '../../Constants'

let network = 4

export default class DBETVETTokenContract extends BaseContract {
    constructor(web3, thor) {
        super(web3)
        this.listener = null
        this.contract = new thor.eth.Contract(
            Contract_DBETVETToken.abi,
            DBET_VET_TOKEN_ADDRESS
        )

    }

    balanceOf(address) {
        return this.contract.methods.balanceOf(address).call({
            from: window.web3Object.eth.defaultAccount.address
        })
    }
}
