/**
 * Created by user on 9/7/2017.
 */

import DecentBetToken from '../../build/contracts/DecentBetToken.json'

const async = require('async')
const contract = require('truffle-contract')

let web3
let provider

let decentBetToken

let decentBetTokenInstance

const TYPE_DBET_TOKEN = 0

class ContractHelper {

    constructor() {
        web3 = window.web3
        provider = window.web3.currentProvider
        decentBetToken = contract(DecentBetToken)
        decentBetToken.setProvider(provider)
    }

    getTokenInstance = () => {
        return decentBetTokenInstance
    }

    getTokenContract = (callback) => {
        this.getContract(TYPE_DBET_TOKEN, callback)
    }

    getAllContracts = (callback) => {
        const self = this
        async.parallel({
            token: (callback) => {
                this.getTokenContract((instance) => {
                    self.setInstance(TYPE_DBET_TOKEN, instance)
                    callback(null, instance)
                })
            }
        }, (err, results) => {
            console.log('getAllContracts', err, JSON.stringify(results))
            callback(false, results.token)
        })
    }

    getContract = (type, callback) => {
        const self = this
        let instance = this.getInstance(type)
        if (!instance) {
            this.getContractObject(type).deployed().then(function (_instance) {
                self.setInstance(type, _instance)
                callback(_instance)
            }).catch(function (err) {
                console.log('Error getting contract', err.message)
                callback(null)
            })
        } else
            callback(instance)
    }

    getContractObject = (type) => {
        switch (type) {
            case TYPE_DBET_TOKEN:
                return decentBetToken
                break
        }
        return null
    }

    getInstance = (type) => {
        switch (type) {
            case TYPE_DBET_TOKEN:
                return decentBetTokenInstance
                break
        }
        return null
    }

    setInstance = (type, instance) => {
        switch (type) {
            case TYPE_DBET_TOKEN:
                decentBetTokenInstance = instance
                break
        }
    }

    /** Contract wrappers */
    getWrappers = () => {
        const self = this
        return {
            token: () => {
                return {
                    allowance: (owner, spender) => {
                        return decentBetTokenInstance.allowance.call(owner, spender, {
                            from: window.web3.eth.defaultAccount,
                        })
                    },
                    approve: (address, value) => {
                        return decentBetTokenInstance.approve.sendTransaction(address, value, {
                            from: window.web3.eth.defaultAccount,
                        })
                    }
                }
            }
        }
    }
}

export default ContractHelper