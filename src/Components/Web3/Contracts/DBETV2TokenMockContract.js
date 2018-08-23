import BaseContract from './BaseContract'
import { filter } from 'rxjs/operators'
import { DBET_V2_TOKEN_ADDRESS, DBET_VET_DEPOSIT_ADDRESS } from '../../Constants'
const ethAbi = require('web3-eth-abi')
const ContractAbi = require('../../Base/Contracts/DBETV2TokenMock.json')


export default class DBETV2TokenMockContract extends BaseContract {
    constructor(web3) {
        super(web3)
        this.listener = null
        this.contract = new web3.eth.Contract(ContractAbi.abi, DBET_V2_TOKEN_ADDRESS)
    }

    // RxJS code sample
    // pending fix issue with promise
    // async RXJS__approveWithConfirmation(privateKey, address, amount) {
    //     const txHash = await this.approve(privateKey, address, amount)

    //     return await this.getAllEvents$()
    //         .pipe(
    //             filter(
    //                 i => i.transactionHash === txHash && i.event === 'Approval'
    //             ),
    //             map(i => {
    //                 return true
    //             })
    //         )
    //         .toPromise()
    // }
    
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
    balanceOf(address) {
        return this.contract.methods.balanceOf(address).call({
            from: this.web3.eth.defaultAccount.address
        })
    }
}
