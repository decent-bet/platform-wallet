/**
 * Created by user on 9/7/2017.
 */

import DecentBetToken from '../../build/contracts/DecentBetToken.json'

import Web3 from 'web3'

const async = require('async')
const contract = require('truffle-contract')

import KeyHandler from './Base/KeyHandler'
const keyHandler = new KeyHandler()

let web3
let provider

let decentBetToken

let decentBetTokenInstance

const TYPE_DBET_TOKEN = 0

class ContractHelper {

    constructor() {
        this.init()
    }

    init = () => {
        web3 = window.web3
        provider = window.web3.currentProvider
        decentBetToken = contract(DecentBetToken)
        decentBetToken.setProvider(provider)
    }

    resetWeb3 = (httpProvider) => {
        let defaultAccount = window.web3.eth.defaultAccount

        const provider = new Web3.providers.HttpProvider(httpProvider)

        window.web3 = new Web3(provider)
        window.web3.defaultAccount = defaultAccount

        keyHandler.saveNetworkProvider(httpProvider)

        this.init()

        this.getAllContracts((err, token) => {
            console.log('getAllContracts: ',
                err, token.address, window.web3.eth.defaultAccount, window.web3.eth.accounts[0])
        })
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
                    callback(instance == null, instance)
                })
            }
        }, (err, results) => {
            callback(err, results.token)
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
                console.log('getContract', err.message)
                callback(null)
            })
        } else {
            callback(instance)
        }
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
                    /**
                     * Events
                     * */
                    logTransfer: (address, isFrom, fromBlock, toBlock) => {
                        let options = {}
                        options[isFrom ? 'from' : 'to'] = address
                        return decentBetTokenInstance.Transfer(options, {
                            fromBlock: fromBlock ? fromBlock : 0,
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },

                    /**
                     * Setters
                     * */
                    allowance: (owner, spender) => {
                        return decentBetTokenInstance.allowance.call(owner, spender)
                    },
                    approve: (address, value) => {
                        return decentBetTokenInstance.approve.sendTransaction(address, value)
                    },

                    /**
                     * Getters
                     * */
                    balanceOf: (address) => {
                        return decentBetTokenInstance.balanceOf.call(address, {
                            from: window.web3.eth.defaultAccount.address
                        })
                    }
                }
            }
        }
    }
}

export default ContractHelper