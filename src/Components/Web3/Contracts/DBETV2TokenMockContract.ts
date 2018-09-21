import BaseContract from './BaseContract'
import { filter } from 'rxjs/operators'
import { DBET_V2_TOKEN_ADDRESS, DBET_VET_DEPOSIT_ADDRESS } from '../../Constants'
import Web3 from 'web3';
import { Contract } from 'web3/types';

const ethAbi = require('web3-eth-abi')
const ContractAbi = require('../../Base/Contracts/DBETV2TokenMock.json')


export default class DBETV2TokenMockContract extends BaseContract {
    private listener: any;
    private contract: Contract;
    constructor(web3: Web3) {
        super(web3)
        this.listener = null
        this.contract = new web3.eth.Contract(
            ContractAbi.abi,
            DBET_V2_TOKEN_ADDRESS
        )
    }

    /**
     * Get logs using getPastEvents and merge timestamp from getBlock
     */
    public async getTransferEventLogs() {
        let toLogs = this.getLogs(this.contract, 'Transfer', {
            to: this.web3.eth.defaultAccount,
        })

        let fromLogs = this.getLogs(this.contract, 'Transfer', {
            from: this.web3.eth.defaultAccount,
        })

        let logs = await Promise.all([
            toLogs,
            fromLogs
        ])

        return logs[0].concat(logs[1])
    }

    public approveWithConfirmation(privateKey, addr, amount) {
        return new Promise(async (resolve, reject) => {
            const txHash = await this.approve(privateKey, amount)

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
    public getAllEvents$() {
        this.listener = this.contract.events.allEvents(undefined, () => {})
        return this.fromEmitter(this.listener)
    }
    public allowance(owner, spender) {
        return this.contract.methods.allowance(owner, spender).call()
    }
    public approve(privateKey, value) {
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
                DBET_V2_TOKEN_ADDRESS,
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
    public transfer(address, privateKey, value, gasPrice, callback) {
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
            DBET_V2_TOKEN_ADDRESS,
            gasPrice,
            100000,
            encodedFunctionCall,
            callback
        )
    }

    /**
     * Getters
     * */
    public balanceOf(address) {
        return this.contract.methods.balanceOf(address).call({
            from: this.web3.eth.defaultAccount
        })
    }
}
