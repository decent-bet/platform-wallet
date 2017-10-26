import KeyHandler from './Base/KeyHandler'

const async = require('async')
const constants = require('./Constants')
const contract = require('truffle-contract')
const ethAbi = require('web3-eth-abi')
const EthAccounts = require('web3-eth-accounts')
const keyHandler = new KeyHandler()

const ethAccounts = new EthAccounts(constants.PROVIDER_URL)

const OldToken = require('./Base/contracts.json').oldToken
const NewToken = require('./Base/contracts.json').newToken

const TYPE_DBET_TOKEN_OLD = 0
const TYPE_DBET_TOKEN_NEW = 1

let web3
let provider

let oldToken
let newToken

let oldTokenInstance
let newTokenInstance

class ContractHelper {

    constructor() {
        this.init()
    }

    init = () => {
        web3 = window.web3Object
        provider = window.web3Object.currentProvider
        oldToken = contract({
            abi: OldToken.abi,
            address: OldToken.address,
            unlinked_binary: OldToken.bytecode,
            network_id: 1
        })
        newToken = contract({
            abi: NewToken.abi,
            address: NewToken.address,
            unlinked_binary: NewToken.bytecode,
            network_id: 1
        })
        oldToken.setProvider(provider)
        newToken.setProvider(provider)
    }

    getOldTokenInstance = () => {
        return oldTokenInstance
    }

    getOldTokenContract = (callback) => {
        this.getContract(TYPE_DBET_TOKEN_OLD, callback)
    }

    getNewTokenContract = (callback) => {
        this.getContract(TYPE_DBET_TOKEN_NEW, callback)
    }

    getAllContracts = (callback) => {
        const self = this
        async.parallel({
            oldToken: (callback) => {
                this.getOldTokenContract((instance) => {
                    self.setInstance(TYPE_DBET_TOKEN_OLD, instance)
                    callback(instance == null, instance)
                })
            },
            newToken: (callback) => {
                this.getNewTokenContract((instance) => {
                    self.setInstance(TYPE_DBET_TOKEN_NEW, instance)
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
            case TYPE_DBET_TOKEN_OLD:
                return oldToken
            case TYPE_DBET_TOKEN_NEW:
                return newToken
        }
        return null
    }

    getInstance = (type) => {
        switch (type) {
            case TYPE_DBET_TOKEN_OLD:
                return oldTokenInstance
            case TYPE_DBET_TOKEN_NEW:
                return newTokenInstance
        }
        return null
    }

    setInstance = (type, instance) => {
        switch (type) {
            case TYPE_DBET_TOKEN_OLD:
                oldTokenInstance = instance
                break
            case TYPE_DBET_TOKEN_NEW:
                newTokenInstance = instance
                break
        }
    }

    /** Contract wrappers */
    getWrappers = () => {
        const self = this
        return {
            oldToken: () => {
                return {
                    abi: () => {
                        return OldToken.abi
                    },
                    /**
                     * Setters
                     * */
                    allowance: (owner, spender) => {
                        return oldTokenInstance.allowance.call(owner, spender)
                    },
                    approve: (address, value) => {
                        return oldTokenInstance.approve.sendTransaction(address, value)
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
                        window.web3Object.eth.getTransactionCount(window.web3Object.eth.defaultAccount, (err, count) => {
                            console.log('Tx count', err, count)
                            if (!err) {
                                let tx = {
                                    from: window.web3Object.eth.defaultAccount,
                                    to: oldTokenInstance.address,
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
                        return oldTokenInstance.balanceOf.call(address, {
                            from: window.web3Object.eth.defaultAccount.address
                        })
                    }
                }
            },
            newToken: () => {
                return {
                    abi: () => {
                        return NewToken.abi
                    },
                    /**
                     * Setters
                     * */
                    allowance: (owner, spender) => {
                        return newTokenInstance.allowance.call(owner, spender)
                    },
                    approve: (address, value) => {
                        return newTokenInstance.approve.sendTransaction(address, value)
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
                        window.web3Object.eth.getTransactionCount(window.web3Object.eth.defaultAccount, (err, count) => {
                            console.log('Tx count', err, count)
                            if (!err) {
                                let tx = {
                                    from: window.web3Object.eth.defaultAccount,
                                    to: newTokenInstance.address,
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
                        return newTokenInstance.balanceOf.call(address, {
                            from: window.web3Object.eth.defaultAccount.address
                        })
                    }
                }
            }
        }
    }
}

export default ContractHelper