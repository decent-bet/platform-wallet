const async = require('async')
const constants = require('./Constants')
const contract = require('truffle-contract')
const ethAbi = require('web3-eth-abi')
const EthAccounts = require('web3-eth-accounts')

const ethAccounts = new EthAccounts(constants.PROVIDER_URL)

const OldToken = require('./Base/contracts.json').oldToken
const NewToken = require('./Base/contracts.json').newToken
import House from '../contracts/House.json'
import HouseAuthorizedController from '../contracts/HouseAuthorizedController.json'
let web3
let provider

let oldToken
let newToken

let oldTokenInstance
let newTokenInstance
let houseInstance
let houseFundsControllerInstance
let houseAuthorizedControllerInstance
let houseSessionsControllerInstance
let house, houseAuthorizedController, houseFundsController
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
        house = contract(House)
        houseAuthorizedController = contract(HouseAuthorizedController)
        oldToken.setProvider(provider)
        newToken.setProvider(provider)
        house.setProvider(provider)
        houseAuthorizedController.setProvider(provider)
    }

    getOldTokenContract = (callback) => {
        this.getContract(constants.TOKEN_TYPE_DBET_TOKEN_OLD, callback)
    }

    getNewTokenContract = (callback) => {
        this.getContract(constants.TOKEN_TYPE_DBET_TOKEN_NEW, callback)
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
            house: (callback) => {
                this.getHouseContract((instance) => {
                    self.setInstance(constants.TYPE_HOUSE, instance)
                    callback(null, instance)
                })
            },
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
        console.log('getContractObject() seeking ' + type)
        switch (type) {
            case constants.TOKEN_TYPE_DBET_TOKEN_OLD:
                return oldToken
            case constants.TOKEN_TYPE_DBET_TOKEN_NEW:
                return newToken
            case constants.TYPE_HOUSE:
                return house
            case constants.TYPE_HOUSE_AUTHORIZED_CONTROLLER:
                return houseAuthorizedController
            case constants.TYPE_HOUSE_FUNDS_CONTROLLER:
                return houseFundsController
        }
        return null
    }

    getInstance = (type) => {
        switch (type) {
            case constants.TOKEN_TYPE_DBET_TOKEN_OLD:
                return oldTokenInstance
            case constants.TOKEN_TYPE_DBET_TOKEN_NEW:
                return newTokenInstance
            case constants.TYPE_HOUSE:
                return houseInstance
            case constants.TYPE_HOUSE_AUTHORIZED_CONTROLLER:
                return houseAuthorizedControllerInstance
            case constants.TYPE_HOUSE_FUNDS_CONTROLLER:
                return houseFundsControllerInstance
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
            case constants.TYPE_HOUSE:
                houseInstance = instance
                break
        }
    }
    getHouseInstance = () => {
        return houseInstance
    }
    getHouseAuthorizedControllerInstance = () => {
        return houseAuthorizedControllerInstance
    }

    getHouseFundsControllerInstance = () => {
        return houseFundsControllerInstance
    }

    getHouseSessionsControllerInstance = () => {
        return houseSessionsControllerInstance
    }
    getHouseContract = (callback) => {
        this.getContract(constants.TYPE_HOUSE, callback)
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
            }
        }
    }
    house = () => {
        return {
            /**
             * Getters
             */
            getCurrentSession: () => {
                return houseInstance.currentSession()
            },
            // Mapping (uint => Session)
            getSession: (sessionNumber) => {
                return houseSessionsControllerInstance.sessions(sessionNumber)
            },
            getHouseFunds: (sessionNumber) => {
                return houseFundsControllerInstance.houseFunds(sessionNumber)
            },
            getUserCreditsForSession: (sessionNumber, address) => {
                return houseFundsControllerInstance.getUserCreditsForSession.call(sessionNumber, address, {
                    from: window.web3Object.eth.defaultAccount
                })
            },
            getAuthorizedAddresses: (index) => {
                return houseAuthorizedControllerInstance.authorizedAddresses(index)
            },
            addToAuthorizedAddresses: (address) => {
                return houseAuthorizedControllerInstance.addToAuthorizedAddresses(address)
            },
            removeFromAuthorizedAddresses: (address) => {
                return houseAuthorizedControllerInstance.removeFromAuthorizedAddresses(address)
            },
            /**
             * Setters
             */
            purchaseCredits: (amount) => {
                return houseInstance.purchaseCredits.sendTransaction(amount, {
                    from: window.web3Object.eth.defaultAccount,
                    gas: 5000000
                })
            },
            /**
             * Events
             */
            logPurchasedCredits: (sessionNumber, fromBlock, toBlock) => {
                return houseInstance.LogPurchasedCredits({
                    creditHolder: window.web3Object.eth.defaultAccount,
                    session: sessionNumber
                }, {
                    fromBlock: fromBlock ? fromBlock : 0,
                    toBlock: toBlock ? toBlock : 'latest'
                })
            },
            logLiquidateCredits: (sessionNumber, fromBlock, toBlock) => {
                return houseInstance.LogLiquidateCredits({
                    creditHolder: window.web3Object.eth.defaultAccount,
                    session: sessionNumber
                }, {
                    fromBlock: fromBlock ? fromBlock : 0,
                    toBlock: toBlock ? toBlock : 'latest'
                })
            }
        }
    }
    signAndSendRawTransaction = (privateKey, to, gasPrice, gas, data, callback) => {
        window.web3Object.eth.getTransactionCount(window.web3Object.eth.defaultAccount, (err, count) => {
            console.log('Tx count', err, count)
            if (!err) {
                let tx = {
                    from: window.web3Object.eth.defaultAccount,
                    to: to,
                    gas: gas,
                    data: data,
                    nonce: count
                }

                /** If not set, it'll be automatically pulled from the Ethereum network */
                if (gasPrice)
                    tx.gasPrice = gasPrice

                ethAccounts.signTransaction(tx, privateKey, (err, res) => {
                    console.log('Signed raw tx', err, res ? res.rawTransaction : '')
                    if (!err)
                        web3.eth.sendRawTransaction(res.rawTransaction, callback)
                    else
                        callback(true, 'Error signing transaction')
                })
            } else
                callback(true, 'Error retrieving nonce')
        })
    }
}

export default ContractHelper