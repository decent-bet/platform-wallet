const async = require('async')
const constants = require('./Constants')
const contract = require('truffle-contract')
const ethAbi = require('web3-eth-abi')
const EthAccounts = require('web3-eth-accounts')

const ethAccounts = {
    mainnet: new EthAccounts(constants.PROVIDER_MAINNET_URL),
    dev: new EthAccounts(constants.PROVIDER_DEV_URL)
}

const OldToken = require('./Base/contracts.json').mainnet.oldToken
const NewToken = require('./Base/contracts.json').mainnet.newToken
const House = require('./Base/contracts.json').dev.house
const TestDecentBetToken = require('./Base/contracts.json').dev.testDecentBetToken
const HouseAuthorizedController = require('./Base/contracts.json').dev.houseAuthorizedController

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
let testDecentBetTokenInstance
let house, houseAuthorizedController, houseFundsController, testDecentBetToken

class ContractHelper {

    constructor() {
        this.init()
    }

    getContractObj = (_contract, isMainnet) => {
        return contract({
            abi: _contract.abi,
            address: _contract.address,
            unlinked_binary: _contract.bytecode,
            network_id: isMainnet ? 1 : 10
        })
    }

    init = () => {
        web3 = window.web3Object
        provider = {
            mainnet: window.web3Object.mainnet.currentProvider,
            dev: window.web3Object.dev.currentProvider
        }
        oldToken = this.getContractObj(OldToken, true)
        newToken = this.getContractObj(NewToken, true)
        house = this.getContractObj(House, false)
        houseAuthorizedController = this.getContractObj(HouseAuthorizedController, false)
        testDecentBetToken = this.getContractObj(TestDecentBetToken, false)
        oldToken.setProvider(provider.mainnet)
        newToken.setProvider(provider.mainnet)
        house.setProvider(provider.dev)
        houseAuthorizedController.setProvider(provider.dev)
        testDecentBetToken.setProvider(provider.dev)
    }

    getOldTokenContract = (callback) => {
        this.getContract(constants.TOKEN_TYPE_DBET_TOKEN_OLD, callback)
    }

    getNewTokenContract = (callback) => {
        this.getContract(constants.TOKEN_TYPE_DBET_TOKEN_NEW, callback)
    }

    getHouseContract = (callback) => {
        this.getContract(constants.TYPE_HOUSE, callback)
    }

    getTestDecentBetTokenContract = (callback) => {
        this.getContract(constants.TYPE_TEST_DECENT_BET_TOKEN, callback)
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
            houseAuthorizedController: (callback) => {
                this.getHouseContract((instance) => {
                    self.setInstance(constants.TYPE_HOUSE_AUTHORIZED_CONTROLLER, instance)
                    callback(null, instance)
                })
            },
            testDecentBetToken: (callback) => {
                this.getTestDecentBetTokenContract((instance) => {
                    self.setInstance(constants.TYPE_TEST_DECENT_BET_TOKEN, instance)
                    callback(null, instance)
                })
            }
        }, (err, results) => {
            callback(err, results.token)
        })
    }

    getContract = (type, callback) => {
        console.log('getContract', type)
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
            case constants.TYPE_TEST_DECENT_BET_TOKEN:
                return testDecentBetToken
            default:
                return null
        }
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
            case constants.TYPE_TEST_DECENT_BET_TOKEN:
                return testDecentBetTokenInstance
            default:
                return null
        }
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
            case constants.TYPE_HOUSE_AUTHORIZED_CONTROLLER:
                houseAuthorizedControllerInstance = instance
                break
            case constants.TYPE_TEST_DECENT_BET_TOKEN:
                testDecentBetTokenInstance = instance
                break
            default:
                break
        }
    }

    getHouseInstance = () => {
        return houseInstance
    }

    getTestDecentBetTokenInstance = () => {
        return testDecentBetTokenInstance
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
                        return oldTokenInstance.balanceOf.call(address)
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
                        return newTokenInstance.balanceOf.call(address)
                    }
                }
            },
            testDecentBetToken: () => {
                return {
                    abi: () => {
                        return TestDecentBetToken.abi
                    },
                    /**
                     * Setters
                     * */
                    allowance: (owner, spender) => {
                        return testDecentBetTokenInstance.allowance.call(owner, spender)
                    },
                    approve: (address, value) => {
                        return testDecentBetTokenInstance.approve.sendTransaction(address, value)
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
                        self.signAndSendRawTransaction(privateKey, testDecentBetTokenInstance.address, gasPrice,
                            100000, encodedFunctionCall, callback)
                    },
                    /**
                     * Getters
                     * */
                    balanceOf: (address) => {
                        return testDecentBetTokenInstance.balanceOf.call(address)
                    }
                }
            },
            house: () => {
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
                        return houseFundsControllerInstance.getUserCreditsForSession.call(sessionNumber, address)
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
                        return houseInstance.purchaseCredits.sendTransaction(amount)
                    },
                    /**
                     * Events
                     */
                    logPurchasedCredits: (sessionNumber, fromBlock, toBlock) => {
                        return houseInstance.LogPurchasedCredits({
                            creditHolder: window.web3Object.dev.eth.defaultAccount,
                            session: sessionNumber
                        }, {
                            fromBlock: fromBlock ? fromBlock : 0,
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logLiquidateCredits: (sessionNumber, fromBlock, toBlock) => {
                        return houseInstance.LogLiquidateCredits({
                            creditHolder: window.web3Object.dev.eth.defaultAccount,
                            session: sessionNumber
                        }, {
                            fromBlock: fromBlock ? fromBlock : 0,
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    }
                }
            }
        }
    }
    signAndSendRawTransaction = (privateKey, to, gasPrice, gas, data, callback) => {
        window.web3Object.eth.getTransactionCount(
            window.web3Object.mainnet.eth.defaultAccount, (err, count) => {
                if (!err) {
                    let tx = {
                        from: window.web3Object.mainnet.eth.defaultAccount,
                        to: to,
                        gas: gas,
                        data: data,
                        nonce: count
                    }

                    /** If not set, it'll be automatically pulled from the Ethereum network */
                    if (gasPrice)
                        tx.gasPrice = gasPrice

                    const isMainnet = (to === oldTokenInstance.address || to === newTokenInstance.address)
                    const network = isMainnet ? 'mainnet' : 'dev'

                    ethAccounts[network].signTransaction(tx, privateKey, (err, res) => {
                        console.log('Signed raw tx', err, res ? res.rawTransaction : '')
                        if (!err)
                            web3[network].eth.sendRawTransaction(res.rawTransaction, callback)
                        else
                            callback(true, 'Error signing transaction')
                    })
                } else
                    callback(true, 'Error retrieving nonce')
            })
    }
}

export default ContractHelper
