import {TOKEN_TYPE_DBET_TOKEN_NEW} from "./Constants";

const async = require('async')
const constants = require('./Constants')
const contract = require('truffle-contract')
const ethAbi = require('web3-eth-abi')
const EthAccounts = require('web3-eth-accounts')

const ethAccounts = {
    mainnet: new EthAccounts(constants.PROVIDER_MAINNET_URL),
    dev: new EthAccounts(constants.PROVIDER_DEV_URL)
}

const { contracts } = require('./Base/Contracts')

let web3

let contractObjects = {}
let contractInstances = {}

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

    // Returns a truffle contract object from a contract JSON
    _getTruffleContract = (_contract) => {
        return contract({
            abi: _contract.abi,
            address: _contract.networks[this._getContractNetworkId(_contract)].address,
            unlinked_binary: _contract.bytecode,
            network_id: this._getContractNetworkId(_contract)
        })
    }

    // Returns JSON for contract type
    _getContractJSONForType = (type) => {
        return contracts[type]
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
        const self = this
        web3 = window.web3Object
        // Initialize contract objects
        constants.CONTRACT_TYPES.forEach((type) => {
            self._setContractObject(type)
        })
    }

    _getContractAndSetInstance = (type, callback) => {
        const self = this
        this._getContract(type, (instance) => {
            self._setInstance(type, instance)
            callback(instance === null, instance)
        })
    }

    getAllContracts = (callback) => {
        const self = this
        async.parallel(constants.CONTRACT_TYPES.map((type) => {
            return (callback) => {
                self._getContractAndSetInstance(type, (instance) => {
                    callback(instance === null, instance)
                })
            }
        }), (err, results) => {
            callback(err, results)
        })
    }

    _getContract = (type, callback) => {
        console.log('_getContract', type)
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

    // Initializes a truffle contract
    _setContractObject = (type) => {
        contractObjects[type] =
            this._getTruffleContract(this._getContractJSONForType(type))
        contractObjects[type].setProvider(
            this._getProvider(this._getContractJSONForType(type))
        )
    }

    _getContractObject = (type) => {
        return contractObjects[type]
    }

    _getInstance = (type) => {
        return contractInstances[type]
    }

    _setInstance = (type, instance) => {
        contractInstances[type] = instance
    }

    getOldTokenInstance = () => {
        return contractInstances[constants.TOKEN_TYPE_DBET_TOKEN_OLD]
    }

    getNewTokenInstance = () => {
        return contractInstances[constants.TOKEN_TYPE_DBET_TOKEN_NEW]
    }

    getHouseInstance = () => {
        return contractInstances[constants.TYPE_HOUSE]
    }

    getTestDecentBetTokenInstance = () => {
        return contractInstances[constants.TYPE_TEST_DECENT_BET_TOKEN]
    }

    getHouseAuthorizedControllerInstance = () => {
        return contractInstances[constants.TYPE_HOUSE_AUTHORIZED_CONTROLLER]
    }

    getHouseFundsControllerInstance = () => {
        return contractInstances[constants.TYPE_HOUSE_FUNDS_CONTROLLER]
    }

    getHouseLotteryControllerInstance = () => {
        return contractInstances[constants.TYPE_HOUSE_LOTTERY_CONTROLLER]
    }

    getHouseSessionsControllerInstance = () => {
        return contractInstances[constants.TYPE_HOUSE_SESSIONS_CONTROLLER]
    }

    /** Contract wrappers */
    getWrappers = () => {
        const self = this
        return {
            oldToken: () => {
                return {
                    abi: () => {
                        return contracts.oldToken.json.abi
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
                        self.signAndSendRawTransaction(
                            privateKey,
                            contractInstances[constants.TOKEN_TYPE_DBET_TOKEN_OLD].address,
                            gasPrice,
                            100000,
                            encodedFunctionCall,
                            callback
                        )
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
                        self.signAndSendRawTransaction(
                            privateKey,
                            contractInstances[constants.TOKEN_TYPE_DBET_TOKEN_OLD].address,
                            null,
                            200000,
                            encodedFunctionCall,
                            callback
                        )
                    },
                    /**
                     * Getters
                     * */
                    balanceOf: (address) => {
                        return self.getOldTokenInstance().balanceOf.call(address)
                    }
                }
            },
            newToken: () => {
                return {
                    abi: () => {
                        return contracts.newToken.json.abi
                    },
                    /**
                     * Setters
                     * */
                    allowance: (owner, spender) => {
                        return self.getNewTokenInstance()
                            .allowance.call(
                                owner,
                                spender
                            )
                    },
                    approve: (address, value) => {
                        return self.getNewTokenInstance()
                            .approve.sendTransaction(
                                address,
                                value
                            )
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
                        self.signAndSendRawTransaction(
                            privateKey,
                            contractInstances[TOKEN_TYPE_DBET_TOKEN_NEW].address,
                            gasPrice,
                            100000,
                            encodedFunctionCall,
                            callback
                        )
                    },
                    /**
                     * Getters
                     * */
                    balanceOf: (address) => {
                        return self.getNewTokenInstance()
                            .balanceOf.call(address)
                    }
                }
            },
            testDecentBetToken: () => {
                return {
                    abi: () => {
                        return contracts.testDecentBetToken.json.abi
                    },
                    /**
                     * Setters
                     * */
                    allowance: (owner, spender) => {
                        return self.getTestDecentBetTokenInstance().allowance.call(owner, spender)
                    },
                    approve: (address, value) => {
                        return self.getTestDecentBetTokenInstance().approve.sendTransaction(address, value)
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
                        self.signAndSendRawTransaction(
                            privateKey,
                            contractInstances[constants.TYPE_TEST_DECENT_BET_TOKEN].address,
                            gasPrice,
                            100000,
                            encodedFunctionCall,
                            callback
                        )
                    },
                    /**
                     * Getters
                     * */
                    balanceOf: (address) => {
                        return self.getTestDecentBetTokenInstance().balanceOf.call(address)
                    },
                    faucet: (privateKey) => {
                        console.log('Sending faucet tx')

                        let encodedFunctionCall = ethAbi.encodeFunctionCall(
                            {
                                name: 'faucet',
                                type: 'function',
                                inputs: []
                            },
                            []
                        )

                        return self.signAndSendRawTransaction(
                            privateKey,
                            self.getTestDecentBetTokenInstance().address,
                            null,
                            5000000,
                            encodedFunctionCall
                        )
                    }
                }
            },
            house: () => {
                return {
                    /**
                     * Getters
                     */
                    getCurrentSession: () => {
                        return self.getHouseInstance().currentSession()
                    },
                    // Mapping (uint => Session)
                    getSession: sessionNumber => {
                        return self.getHouseSessionsControllerInstance().sessions(
                            sessionNumber
                        )
                    },
                    getHouseFunds: sessionNumber => {
                        return self.getHouseFundsControllerInstance()
                            .houseFunds(sessionNumber)
                    },
                    getUserCreditsForSession: (sessionNumber, address) => {
                        return self.getHouseFundsControllerInstance()
                            .getUserCreditsForSession.call(
                                sessionNumber,
                                address,
                                {
                                    from: web3.dev.eth.defaultAccount
                                }
                            )
                    },
                    getAuthorizedAddresses: index => {
                        return self.getHouseAuthorizedControllerInstance()
                            .authorizedAddresses(index)
                    },
                    addToAuthorizedAddresses: address => {
                        return self.getHouseAuthorizedControllerInstance()
                            .addToAuthorizedAddresses(address)
                    },
                    removeFromAuthorizedAddresses: address => {
                        return self.getHouseAuthorizedControllerInstance()
                            .removeFromAuthorizedAddresses(address)
                    },
                    lotteries: session => {
                        return self.getHouseLotteryControllerInstance()
                            .lotteries(session)
                    },
                    lotteryTicketHolders: (session, ticketNumber) => {
                        return self.getHouseLotteryControllerInstance()
                            .lotteryTicketHolders(
                                session,
                                ticketNumber
                            )
                    },
                    lotteryUserTickets: (session, address, index) => {
                        return self.getHouseLotteryControllerInstance()
                            .lotteryUserTickets(
                                session,
                                address,
                                index
                            )
                    },
                    /**
                     * Setters
                     */
                    purchaseCredits: amount => {
                        return self.getHouseInstance()
                            .purchaseCredits.sendTransaction(
                                amount,
                                {
                                    from: web3.dev.eth.defaultAccount,
                                    gas: 5000000
                                }
                            )
                    },
                    /**
                     * Events
                     */
                    logPurchasedCredits: (
                        sessionNumber,
                        fromBlock,
                        toBlock
                    ) => {
                        return self.getHouseInstance().LogPurchasedCredits(
                            {
                                creditHolder: web3.dev.eth.defaultAccount,
                                session: sessionNumber
                            },
                            {
                                fromBlock: fromBlock ? fromBlock : 0,
                                toBlock: toBlock ? toBlock : 'latest'
                            }
                        )
                    },
                    logLiquidateCredits: (
                        sessionNumber,
                        fromBlock,
                        toBlock
                    ) => {
                        return self.getHouseInstance().LogLiquidateCredits(
                            {
                                creditHolder: web3.dev.eth.defaultAccount,
                                session: sessionNumber
                            },
                            {
                                fromBlock: fromBlock ? fromBlock : 0,
                                toBlock: toBlock ? toBlock : 'latest'
                            }
                        )
                    }
                }
            }
        }
    }

    // Returns whether a transaction is a mainnet transaction based on it's "to" address
    _isMainnetTx = (to) => {
        return (
            to === contractInstances[constants.TOKEN_TYPE_DBET_TOKEN_OLD] ||
            to === contractInstances[constants.TOKEN_TYPE_DBET_TOKEN_NEW]
        )
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
