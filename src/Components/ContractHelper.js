import DecentBetToken from '../../build/contracts/DecentBetToken.json'

import KeyHandler from './Base/KeyHandler'

const async = require('async')
const constants = require('./Constants')
const contract = require('truffle-contract')
const ethAbi = require('web3-eth-abi')
const EthAccounts = require('web3-eth-accounts')
const keyHandler = new KeyHandler()

const ethAccounts = new EthAccounts(constants.PROVIDER_URL)

const TYPE_DBET_TOKEN = 0

let web3
let provider

let decentBetToken

let decentBetTokenInstance

class ContractHelper {

    constructor() {
        this.init()
    }

    init = () => {
        web3 = window.web3Object
        provider = window.web3Object.currentProvider
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
                    abi: () => {
                        return DecentBetToken.abi
                    },
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
                    transfer: (address, value, gasPrice, callback) => {
                        let encodedFunctionCall = ethAbi.encodeFunctionCall({
                            name: 'transfer',
                            type: 'function',
                            inputs: [
                                {
                                    type: 'address',
                                    name: '_to'
                                },
                                {
                                    type: 'uint256',
                                    name: '_value'
                                }
                            ]
                        }, [address, value])
                        console.log('Encoded function call', encodedFunctionCall)

                        window.web3Object.eth.getTransactionCount(window.web3Object.eth.defaultAccount, (err, count) => {
                            console.log('Tx count', err, count)
                            if (!err) {
                                let tx = {
                                    from: window.web3Object.eth.defaultAccount,
                                    to: decentBetTokenInstance.address,
                                    gasPrice: gasPrice,
                                    gas: 100000,
                                    data: encodedFunctionCall,
                                    nonce: count
                                }

                                console.log('Raw tx params', tx)

                                ethAccounts.signTransaction(tx, keyHandler.get(), (err, res) => {
                                    console.log('Signed raw tx', err, res ? res.rawTransaction : '')
                                    if (!err)
                                        web3.eth.sendRawTransaction(res.rawTransaction, callback)
                                    else
                                        callback(true, 'Error signing transaction')
                                })
                            } else
                                callback(true, 'Error retrieving nonce')
                        })
                    },
                    /**
                     * Getters
                     * */
                    balanceOf: (address) => {
                        return decentBetTokenInstance.balanceOf.call(address, {
                            from: window.web3Object.eth.defaultAccount.address
                        })
                    }
                }
            }
        }
    }
}

export default ContractHelper