const async = require('async')
const constants = require('./Constants')
const contract = require('truffle-contract')
const ethAbi = require('web3-eth-abi')
const EthAccounts = require('web3-eth-accounts')

const ethAccounts = {
    mainnet: new EthAccounts(constants.PROVIDER_MAINNET_URL),
    dev: new EthAccounts(constants.PROVIDER_DEV_URL)
}

const {
    OldToken,
    NewToken,
    House,
    TestDecentBetToken,
    HouseAuthorizedController
} = require('./Base/Contracts')

let web3

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

    // Returns the network ID from a contract's ABI
    _getContractNetworkId = (_contract) => {
        return Object.keys(_contract.networks)[0]
    }

    // Returns the network type from a contract's ABI
    _getContractNetwork = (_contract) => {
        return this._getContractNetworkId(_contract) === constants.NETWORK_ID_MAINNET ?
            constants.NETWORK_MAINNET :
            constants.NETWORK_DEV
    }

    // Returns a truffle contract object from a contract's ABI
    _getContractObj = (_contract) => {
        return contract({
            abi: _contract.abi,
            address: _contract.networks[this._getContractNetworkId(_contract)].address,
            unlinked_binary: _contract.bytecode,
            network_id: this._getContractNetworkId(_contract)
        })
    }

    // Returns an appropriate web3 provider based on a contract's ABI
    _getProvider = (_contract) => {
        return web3[this._getContractNetwork(_contract)].currentProvider
    }

    // Returns a web3 accounts object for a selected network
    _getEthAccount = (network) => {
        return ethAccounts[network]
    }

    // Initialize ContractHelper
    init = () => {
        web3 = window.web3Object

        // Initialize contract objects
        oldToken = this._getContractObj(OldToken)
        newToken = this._getContractObj(NewToken)
        house = this._getContractObj(House)
        houseAuthorizedController = this._getContractObj(HouseAuthorizedController)
        testDecentBetToken = this._getContractObj(TestDecentBetToken)

        // Set contract object providers
        oldToken.setProvider(this._getProvider(OldToken))
        newToken.setProvider(this._getProvider(NewToken))
        house.setProvider(this._getProvider(House))
        houseAuthorizedController.setProvider(this._getProvider(HouseAuthorizedController))
        testDecentBetToken.setProvider(this._getProvider(TestDecentBetToken))
    }

    _getOldTokenContract = (callback) => {
        this._getContract(constants.TOKEN_TYPE_DBET_TOKEN_OLD, callback)
    }

    _getNewTokenContract = (callback) => {
        this._getContract(constants.TOKEN_TYPE_DBET_TOKEN_NEW, callback)
    }

    _getHouseContract = (callback) => {
        this._getContract(constants.TYPE_HOUSE, callback)
    }

    _getTestDecentBetTokenContract = (callback) => {
        this._getContract(constants.TYPE_TEST_DECENT_BET_TOKEN, callback)
    }

    getAllContracts = (callback) => {
        const self = this
        async.parallel({
            oldToken: (callback) => {
                this._getOldTokenContract((instance) => {
                    self._setInstance(constants.TOKEN_TYPE_DBET_TOKEN_OLD, instance)
                    callback(instance == null, instance)
                })
            },
            newToken: (callback) => {
                this._getNewTokenContract((instance) => {
                    self._setInstance(constants.TOKEN_TYPE_DBET_TOKEN_NEW, instance)
                    callback(instance == null, instance)
                })
            },
            house: (callback) => {
                this._getHouseContract((instance) => {
                    self._setInstance(constants.TYPE_HOUSE, instance)
                    callback(null, instance)
                })
            },
            houseAuthorizedController: (callback) => {
                this._getHouseContract((instance) => {
                    self._setInstance(constants.TYPE_HOUSE_AUTHORIZED_CONTROLLER, instance)
                    callback(null, instance)
                })
            },
            testDecentBetToken: (callback) => {
                this._getTestDecentBetTokenContract((instance) => {
                    self._setInstance(constants.TYPE_TEST_DECENT_BET_TOKEN, instance)
                    callback(null, instance)
                })
            }
        }, (err, results) => {
            callback(err, results)
        })
    }

    _getContract = (type, callback) => {
        const self = this
        let instance = this._getInstance(type)
        if (!instance) {
            this._getContractObject(type).deployed().then(function (_instance) {
                self._setInstance(type, _instance)
                callback(_instance)
            }).catch(function (err) {
                callback(null)
            })
        } else {
            callback(instance)
        }
    }

    _getContractObject = (type) => {
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

    _getInstance = (type) => {
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

    _setInstance = (type, instance) => {
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
                            creditHolder: this._getDefaultAccount(houseInstance.address),
                            session: sessionNumber
                        }, {
                            fromBlock: fromBlock ? fromBlock : 0,
                            toBlock: toBlock ? toBlock : 'latest'
                        })
                    },
                    logLiquidateCredits: (sessionNumber, fromBlock, toBlock) => {
                        return houseInstance.LogLiquidateCredits({
                            creditHolder: this._getDefaultAccount(houseInstance.address),
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

    // Returns whether a transaction is a mainnet transaction based on it's "to" address
    _isMainnetTx = (to) => {
        return (to === oldTokenInstance.address || to === newTokenInstance.address)
    }

    // Returns the network type for a transaction based on it's "to" address
    _getNetworkForTx = (to) => {
        return this._isMainnetTx(to) ? constants.NETWORK_MAINNET : constants.NETWORK_DEV
    }

    // Returns a default account for a transaction based on it's "to" address
    _getDefaultAccount = (to) => {
        return web3[this._getNetworkForTx(to)].eth.defaultAccount
    }

    // Signs a raw transaction with the default accounts' private key and
    // sends it over the appropriate Ethereum network
    signAndSendRawTransaction = (privateKey, to, gasPrice, gas, data, callback) => {
        const network = this._getNetworkForTx(to)
        const defaultAcccount = this._getDefaultAccount

        web3[network].eth.getTransactionCount(
            defaultAcccount, (err, count) => {
                if (!err) {
                    let tx = {
                        from: defaultAcccount,
                        to: to,
                        gas: gas,
                        data: data,
                        nonce: count
                    }

                    /** If not set, it'll be automatically pulled from the Ethereum network */
                    if (gasPrice)
                        tx.gasPrice = gasPrice

                    this._getEthAccount(network).signTransaction(tx, privateKey, (err, res) => {
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
