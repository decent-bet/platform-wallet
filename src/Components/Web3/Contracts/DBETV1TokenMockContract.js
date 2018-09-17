import BaseContract from './BaseContract'
import {
    DBET_V1_TOKEN_ADDRESS,
    DBET_VET_DEPOSIT_ADDRESS,
} from '../../Constants'
import { filter } from 'rxjs/operators'
const ethAbi = require('web3-eth-abi')
const ContractAbi = require('../../Base/Contracts/DBETV1TokenMock.json')


export default class DBETV1TokenMockContract extends BaseContract {
    constructor(web3) {
        super(web3)
        this.listener = null
        this.contract = new web3.eth.Contract(
            ContractAbi.abi,
            DBET_V1_TOKEN_ADDRESS
        )
    }

    approveWithConfirmation(privateKey, address, amount) {
        return new Promise(async (resolve, reject) => {
            const txHash = await this.approve(privateKey, address, amount)

            this
            .getAllEvents$()
            .pipe(
                filter(
                    i => i.transactionHash === txHash && i.event === 'Approval'
                ),
            )
            .subscribe(i => {
                if (i) {
                    return resolve(true)
                }
                return reject()
            })
        })
    }

    /**
     * Get logs using getPastEvents and merge timestamp from getBlock
     */
    async getTransferEventLogs() {
        // On mainnet, get transfer and upgrade event logs
        // On testnet, since mocks do not have upgrade functionality - skip Upgrade events
        if(this.contract.methods.upgrade)
            return await this.getTransferAndUpgradeEventLogs()

        let toLogs = this.getLogs(this.contract, 'Transfer', {
            to: this.web3.eth.defaultAccount,
        })

        let fromLogs = this.getLogs(this.contract, 'Transfer', {
            from: this.web3.eth.defaultAccount,
        })

        let logs = await Promise.all([
            toLogs,
            fromLogs,
        ])

        return helper.flattenNestedArray(logs)
    }

    async getTransferAndUpgradeEventLogs() {
        let toLogs = this.getLogs(this.contract, 'Transfer', {
            to: this.web3.eth.defaultAccount,
        })

        let fromLogs = this.getLogs(this.contract, 'Transfer', {
            from: this.web3.eth.defaultAccount,
        })

        let upgradeLogs = this.getLogs(this.contract, 'Upgrade', {
            _from: this.web3.eth.defaultAccount,
        })

        let logs = await Promise.all([
            toLogs,
            fromLogs,
            upgradeLogs
        ])

        // Replaces a key in an object with a new key
        const replaceKey = (obj, oldKey, newKey) => {
            delete Object.assign(obj, {[newKey]: obj[oldKey] })[oldKey]
        }

        // Upgrade return values need to be formatted to remove prefixed underscores
        const formatUpgradeReturnValues = (logs) => {
            logs = logs.map((log) => {
                if(log.returnValues._from){
                    replaceKey(log.returnValues, '_from', 'from')
                    replaceKey(log.returnValues, '_to', 'to')
                    replaceKey(log.returnValues, '_value', 'value')
                }
                return log
            })
            return logs
        }

        return formatUpgradeReturnValues(helper.flattenNestedArray(logs))
    }

    getAllEvents$() {
        this.listener = this.contract.events.allEvents(null, () => {})
        return this.fromEmitter(this.listener)
    }
    allowance(owner, spender) {
        return this.contract.methods.allowance(owner, spender).call()
    }
    approve(privateKey, value) {
        return new Promise((resolve, reject) => {
            let encodedFunctionCall = ethAbi.encodeFunctionCall(
                {
                    name: 'approve',
                    type: 'function',
                    inputs: [
                        {
                            type: 'address',
                            name: '_spender'
                        },
                        {
                            type: 'uint256',
                            name: '_value'
                        }
                    ]
                },
                [DBET_VET_DEPOSIT_ADDRESS, value]
            )
            this.signAndSendRawTransaction(
                privateKey,
                DBET_V1_TOKEN_ADDRESS,
                null,
                100000,
                encodedFunctionCall,
                (err, res) => {
                    if (err) {
                        reject(err)
                    }
                    return resolve(res)
                }
            )
        })
    }
    transfer(address, privateKey, value, gasPrice, callback) {
        let encodedFunctionCall = ethAbi.encodeFunctionCall(
            {
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
            },
            [address, value]
        )
        this.signAndSendRawTransaction(
            privateKey,
            DBET_V1_TOKEN_ADDRESS,
            gasPrice,
            100000,
            encodedFunctionCall,
            callback
        )
    }
    upgrade(address, privateKey, balance, callback) {
        let encodedFunctionCall = ethAbi.encodeFunctionCall(
            {
                name: 'upgrade',
                type: 'function',
                inputs: [
                    {
                        type: 'uint256',
                        name: '_value'
                    }
                ]
            },
            [balance]
        )
        this.signAndSendRawTransaction(
            privateKey,
            DBET_V1_TOKEN_ADDRESS,
            null,
            200000,
            encodedFunctionCall,
            callback
        )
    }
    /**
     * Getters
     * */
    balanceOf(address) {
        return this.contract.methods.balanceOf(address).call({
            from: this.web3.eth.defaultAccount
        })
    }
}
