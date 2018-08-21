import BaseContract from './BaseContract'
import { Observable, pipe, Subject, interval } from 'rxjs'
import { timeout, filter, catchError } from 'rxjs/operators'
const ethAbi = require('web3-eth-abi')
const Contract_DBETToVETDeposit = require('../../Base/Contracts/DBETToVETDeposit.json')
const Contract_DBETVETToken = require('../../Base/Contracts/DBETVETToken.json')
import {  DBET_VET_DEPOSIT_ADDRESS, DBET_VET_TOKEN_ADDRESS } from '../../Constants'
// const VET_DEPOSIT_ADDR = '0x9e1aC8918a44aFFa9d60df7aEBcd4C5FEcf09167'
// const VET_SENDER_ADDR = '0x944369570958a9b6d67f574e57cfa830fdc881ee'
let network = 4
const WATCH_DEPOSIT_TIMEOUT = 5 * 60000

export default class DBETToVETDepositContract extends BaseContract {
    constructor(web3, thor) {
        super(web3)
        this.listener = null
        this.contract = new web3.eth.Contract(
            Contract_DBETToVETDeposit.abi,
            DBET_VET_DEPOSIT_ADDRESS
        )
        this.senderContract = new thor.eth.Contract(
            Contract_DBETVETToken.abi,
            DBET_VET_TOKEN_ADDRESS
        )

        this.onProgress = new Subject()
    }
    newBlockHeaders$() {
        this.listener = this.web3.eth.subscribe('newBlockHeaders', () => {})
        return this.fromEmitter(this.listener)
    }
    watchForDeposits({ hasV2, address, balance }) {
        return new Promise((resolve, reject) => {
            let message = 'Waiting for token deposit...'
            this.onProgress.next({ status: message })
            console.log(message)
            this.logTokenDeposit$()
                 .pipe(
                     filter(item => {
                        const { _address, amount, isV2, index } = item.returnValues
                        if (_address === address && 
                            amount.toString() === balance.toString() &&
                            isV2 === hasV2) {
                                this.onProgress.next({ status: 'Deposit completed', data: index })
                            return true
                        }
                        return false
                     }),
                     timeout(WATCH_DEPOSIT_TIMEOUT),
                     catchError(reject)
                 )
                 .subscribe(i => {
                        const { index }= i.returnValues

                        message = 'Waiting for token grant...'
                        // find match
                        this.onProgress.next({ status: message })
                        console.log(message)

                        let block = 0
                        let blockHeaderSubscription
                        blockHeaderSubscription = this.newBlockHeaders$().subscribe(blockHeader => {
                            console.log(blockHeader)
                            const { number } = blockHeader
                            if (block === 0) {
                                block = number
                            }
                            console.log(number)
                            if ((number - block) > 15) {
                                this.onProgress.next({ status: 'Pending' })
                                console.log('set to pending after no match found in more than 12 blocks')                                
                                blockHeaderSubscription.unsubscribe()
                                resolve(true)
                            }
                        })

                        this.logGrantTokens$().subscribe(({ returnValues }) => {
                            if (returnValues.index === index) {
                                this.onProgress.next({ status: 'Grant completed', data: index })
                                console.log('token grant completed')
                                blockHeaderSubscription.unsubscribe()
                                resolve(true)
                            }
                        }, reject)

            }, reject)
        })
    }

    logTokenDeposit$() {
        this.listener = this.contract.events.LogTokenDeposit(null, () => {})
        return this.fromEmitter(this.listener)
    }

    logGrantTokens$() {
        this.listener = this.senderContract.events.LogGrantTokens(
            null,
            () => {}
        )
        return this.fromEmitter(this.listener)
    }

    depositToken(privateKey, isV2, balance) {
        return new Promise((resolve, reject) => {
            let encodedFunctionCall = ethAbi.encodeFunctionCall(
                {
                    name: 'depositTokens',
                    type: 'function',
                    inputs: [
                        {
                            type: 'bool',
                            name: 'isV2'
                        },
                        {
                            type: 'uint256',
                            name: 'amount'
                        }
                    ]
                },
                [isV2, balance]
            )
            const tokenType = isV2 ? 'V2' : 'V1'
            this.onProgress.next({ status: `Starting ${tokenType} deposit` })
            this.signAndSendRawTransaction(
                privateKey,
                DBET_VET_DEPOSIT_ADDRESS,
                null,
                100000,
                encodedFunctionCall,
                (err, res) => {
                    if (err) {
                        reject(err)
                    }
                    this.onProgress.next({ status: 'Sent' })
                    return resolve(res)
                }
            )
        })
    }
    allowance(owner, spender) {
        return this.contract.methods.allowance(owner, spender).call()
    }
    depositTokenForV1(privateKey, balance, callback) {
        return this.depositToken(privateKey, false, balance, callback)
    }
    depositTokenForV2(privateKey, balance, callback) {
        return this.depositToken(privateKey, true, balance, callback)
    }

    balanceOf(address) {
        return this.contract.methods.balanceOf(address).call({
            from: window.web3Object.eth.defaultAccount.address
        })
    }
}
