import { NonceHandler } from './NonceHandler'

const async = require('async')
const constants = require('./Constants')
const contract = require('truffle-contract')
const ethAbi = require('web3-eth-abi')
const EthAccounts = require('web3-eth-accounts')
const ethAccounts = new EthAccounts(constants.PROVIDER_URL)

const OldToken = require('./Base/Contracts/DBETV1TokenMock.json') //require('./Base/contracts.json').oldToken
const NewToken = require('./Base/Contracts/DBETV2TokenMock.json') //require('./Base/contracts.json').newToken
const Contract_DBETToVETDeposit = require('./Base/Contracts/DBETToVETDeposit.json')

let web3
let provider
const nonceHandler = new NonceHandler()
let oldToken
let newToken
let vetDeposit

let oldTokenInstance
let newTokenInstance
let vetDepositInstance

const VET_DEPOSIT_ADDR = '0xD6cE9d299E1899B4BBCece03D2ad44b41212f324'
let network = 4
class ContractHelper {

    constructor() {
        this.init()
    }

    init = () => {
        web3 = window.web3Object
        provider = window.web3Object.currentProvider

        oldToken = contract({
            abi: OldToken.abi,
            address: '0x23B694DCEE42ef89f9Eac7358A81A9a651a0603c', // OldToken.networks[network].address,
            network_id: network
        })
        newToken = contract({
            abi: NewToken.abi,
            address: '0xBD4259Ecaa508140aac3c142deE6Efa8e5eB2f7b', // NewToken.networks[network].address,
            network_id: network
        })
        vetDeposit = contract({
            abi: Contract_DBETToVETDeposit.abi,
            address: VET_DEPOSIT_ADDR,// Contract_DBETToVETDeposit.networks[network].address,
            network_id: network
        })
        
        vetDeposit.setProvider(provider)
        oldToken.setProvider(provider)
        newToken.setProvider(provider)

        // Dirty hack for web3@1.0.0 support for localhost testrpc,
        // see https://github.com/trufflesuite/truffle-contract/issues/56#issuecomment-331084530
        if (typeof web3.currentProvider.sendAsync !== 'function') {
            web3.currentProvider.sendAsync = function() {
                return web3.currentProvider.send.apply(
                    web3.currentProvider,
                    arguments
                )
            }
        }
    }

    getOldTokenContract = (callback) => {
        this.getContract(constants.TOKEN_TYPE_DBET_TOKEN_OLD, callback)
    }

    getNewTokenContract = (callback) => {
        this.getContract(constants.TOKEN_TYPE_DBET_TOKEN_NEW, callback)
    }

    getVETDepositContract = (callback) => {
        this.getContract(constants.TOKEN_TYPE_DBET_TOKEN_VET, callback)
    }    

    getAllContracts = (callback) => {
        const self = this
        async.parallel({
            oldToken: (callback) => {
                this.getOldTokenContract((instance) => {
                    self.setInstance(constants.TOKEN_TYPE_DBET_TOKEN_OLD, instance)
                    callback(instance == null, instance)
                })
            },
            newToken: (callback) => {
                this.getNewTokenContract((instance) => {
                    self.setInstance(constants.TOKEN_TYPE_DBET_TOKEN_NEW, instance)
                    callback(instance == null, instance)
                })
            },
            vetDeposit: (callback) => {
                this.getVETDepositContract((instance) => {
                    self.setInstance(constants.TOKEN_TYPE_DBET_TOKEN_VET, instance)
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
                console.log('getContract', err)
                callback(null)
            })
        } else {
            callback(instance)
        }
    }

    getContractObject = (type) => {
        switch (type) {
            case constants.TOKEN_TYPE_DBET_TOKEN_OLD:
                return oldToken
            case constants.TOKEN_TYPE_DBET_TOKEN_NEW:
                return newToken
            case constants.TOKEN_TYPE_DBET_TOKEN_VET:
                return vetDeposit
        }
        return null
    }

    getInstance = (type) => {
        switch (type) {
            case constants.TOKEN_TYPE_DBET_TOKEN_OLD:
                return oldTokenInstance
            case constants.TOKEN_TYPE_DBET_TOKEN_NEW:
                return newTokenInstance
            case constants.TOKEN_TYPE_DBET_TOKEN_VET:
                return vetDepositInstance                
        }
        return null
    }

    setInstance = (type, instance) => {
        switch (type) {
            case constants.TOKEN_TYPE_DBET_TOKEN_OLD:
                oldTokenInstance = instance
                break
            case constants.TOKEN_TYPE_DBET_TOKEN_NEW:
                newTokenInstance = instance
                break
            case constants.TOKEN_TYPE_DBET_TOKEN_VET:
                vetDepositInstance = instance
                break
        }
    }

    /** Contract wrappers */
    getWrappers = () => {
        const self = this
        const depositToken = (privateKey, isV2, balance) => {
            return new  Promise((resolve, reject) => {
                let encodedFunctionCall = ethAbi.encodeFunctionCall({
                    name: 'depositTokens',
                    type: 'function',
                    inputs: [{
                        type: 'bool',
                        name: 'isV2'
                        },
                        {
                            type: 'uint256',
                            name: 'amount'
                        }
                    ]
                }, [isV2, balance])
                self.signAndSendRawTransaction(privateKey, VET_DEPOSIT_ADDR, null,
                    100000, encodedFunctionCall, (err, res) => {
                        if (err) {
                            reject(err)
                        }
                        return resolve(res)
                    })
            })
        }
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
                    transfer: (address, privateKey, value, gasPrice, callback) => {
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
                        self.signAndSendRawTransaction(privateKey, oldTokenInstance.address, gasPrice,
                            100000, encodedFunctionCall, callback)
                    },
                    upgrade: (address, privateKey, balance, callback) => {
                        let encodedFunctionCall = ethAbi.encodeFunctionCall({
                            name: 'upgrade',
                            type: 'function',
                            inputs: [
                                {
                                    type: 'uint256',
                                    name: '_value'
                                }
                            ]
                        }, [balance])
                        self.signAndSendRawTransaction(privateKey, oldTokenInstance.address, null,
                            200000, encodedFunctionCall, callback)
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
                    transfer: (address, privateKey, value, gasPrice, callback) => {
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
                        self.signAndSendRawTransaction(privateKey, newTokenInstance.address, gasPrice,
                            100000, encodedFunctionCall, callback)
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
            },
            vetDeposit: () => {
                return {
                    abi: () => {
                        return Contract_DBETToVETDeposit.abi
                    },
                    /**
                     * Setters
                     * */
                    allowance: (owner, spender) => {
                        return vetDepositInstance.allowance.call(owner, spender)
                    },
                    depositTokenForV1: (privateKey, balance, callback) => {
                        return depositToken(privateKey, false, balance, callback)
                    },  
                    depositTokenForV2: (privateKey, balance, callback) => {
                        return depositToken(privateKey, true, balance, callback)
                    },                                     
                    /**
                     * Getters
                     * */
                    balanceOf: (address) => {
                        return vetDepositInstance.balanceOf.call(address, {
                            from: window.web3Object.eth.defaultAccount.address
                        })
                    }
                }
            }            
        }
    }

    signAndSendRawTransaction = (privateKey, to, gasPrice, gas, data, callback) => {
        window.web3Object
        .eth.getTransactionCount(window.web3Object.eth.defaultAccount, 'latest', 
        (err, count) => {
            console.log('Tx count', err, count)
            
            if (!err) {
                let nonce = nonceHandler.get(count)

                let tx = {
                    from: window.web3Object.eth.defaultAccount,
                    to,
                    gas,
                    data,
                    nonce
                }

                /** If not set, it'll be automatically pulled from the Ethereum network */
                if (gasPrice) tx.gasPrice = gasPrice
                else tx.gasPrice = 10000000000

                console.log(tx)
                ethAccounts.signTransaction(tx, privateKey, (err, res) => {
                    console.log('Signed raw tx', err, res ? res.rawTransaction : '')
                    if (!err)  {
                        nonceHandler.set(nonce)
                        window.web3Object.eth.sendSignedTransaction(res.rawTransaction, callback)
                    }
                    else {
                        callback(true, 'Error signing transaction')
                    }
                })
            } else
                callback(true, 'Error retrieving nonce')
        })
    }
}

export default ContractHelper