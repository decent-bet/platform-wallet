/* eslint-disable no-console */
import BaseContract from './BaseContract'
import { BigNumber } from 'bignumber.js'
import { Subject, interval } from 'rxjs'
import { mergeMap, timeout, filter, catchError, tap } from 'rxjs/operators'
import {  DBET_VET_DEPOSIT_ADDRESS, DBET_VET_TOKEN_ADDRESS } from '../../Constants'
import Helper from '../../Helper'
const ethAbi = require('web3-eth-abi')
const Contract_DBETToVETDeposit = require('../../Base/Contracts/DBETToVETDeposit.json')
const Contract_DBETVETToken = require('../../Base/Contracts/DBETVETToken.json')

const helper = new Helper()
const WATCH_DEPOSIT_TIMEOUT = 6 * 60000

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
    onBlockHeader(blockHeader, block, callback) {
        const { number } = blockHeader
        if (block === 0) {
            block = number
        }
        if ((number - block) > 15) {
            this.onProgress.next({ status: 'Pending' })
            console.log('Set to pending after no match found in more than 12 blocks')                                
            callback()
        }
    }
    watchForDeposits(checkV1Deposit, checkV2Deposit, onDepositCompleted) {
        return new Promise((resolve, reject) => {
            let message = 'Waiting for token deposit...'
            this.onProgress.next({ status: message })
            console.log(message)

            // Watch 12 - block headers
            let grantSubscription
            let block = 0
            let blockHeaderSubscription
            blockHeaderSubscription = this.newBlockHeaders$().subscribe(i => this.onBlockHeader(i, block, () => {
                blockHeaderSubscription.unsubscribe()
                if (grantSubscription) {
                    grantSubscription.unsubscribe()
                }
                resolve(true)
            }))

            let lookup = []
            let pending = 0
            let blockNumber = 0
            this.logTokenDeposit$()
                 .pipe(
                     filter(item => {
                        blockNumber = item.blockNumber
                        const { _address, amount, isV2, index } = item.returnValues
                        if (checkV1Deposit(_address, amount, isV2, index) || checkV2Deposit(_address, amount, isV2, index)) {
                            console.log(`Deposit completed, index ${index}`)
                            this.onProgress.next({ status: `Deposit completed, index ${index}`, data: index })
                            return true
                        }
                        return false
                     }),
                     tap(i =>{
                         console.log(i)
                        const { _address, amount } = i.returnValues
                        let value = helper.formatDbets(new BigNumber(amount))
                        let newTx = {
                            isVET: false,
                            // block: {
                            //     timestamp,
                            //     number: i.blockNumber
                            // },
                            hash: i.transactionHash,
                            from: _address.toLowerCase(),
                            to: i.address.toLowerCase(),
                            value
                        }
                        onDepositCompleted(newTx)
                        message = 'Waiting for token grant...'
                        this.onProgress.next({ status: message })
                        console.log(message)
                     }),
                     timeout(WATCH_DEPOSIT_TIMEOUT),
                     catchError(reject)
                 )
                 .subscribe(i => {
                        const { index }= i.returnValues
                        lookup = [...lookup, parseInt(index, 10)]
                        pending++
                        if (grantSubscription) return

                        grantSubscription = this.pollLogGrantTokens$(blockNumber)
                        .subscribe(item => {
                            const idx = parseInt(item.returnValues.index, 10)
                            if (lookup.includes(idx)) {
                                this.onProgress.next({ status: 'Grant completed', data: index })
                                console.log('Token grant completed')
                                pending--
                                if (pending  === 0) {                                
                                    blockHeaderSubscription.unsubscribe()
                                    grantSubscription.unsubscribe()
                                    resolve(true)
                                }
                            }
                        })
            }, reject)
        })
    }

    pollLogGrantTokens$() {
        return interval(20000).pipe(
            mergeMap(async _ => {
                return await this.senderContract.getPastEvents('LogGrantTokens', {
                    range: {},
                    options: {
                        fromBlock: 'latest',
                        toBlock: 'latest'
                    },
                    order: 'DESC'
                })
            }),
            mergeMap(i => i),            
        )
    }

    logTokenDeposit$() {
        this.listener = this.contract.events.LogTokenDeposit(null, () => {})
        return this.fromEmitter(this.listener)
    }

    depositToken({ privateKey, isV2, balance, vetAddress }) {
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
                        },
                        {
                            type: 'address',
                            name: 'VETAddress'
                        }
                    ]
                },
                [isV2, balance, vetAddress]
            )
            const tokenType = isV2 ? 'V2' : 'V1'
            this.onProgress.next({ status: `Starting ${tokenType} deposit` })
            this.signAndSendRawTransaction(
                privateKey,
                DBET_VET_DEPOSIT_ADDRESS,
                null,
                200000,
                encodedFunctionCall,
                (err, res) => {
                    if (err) {
                        reject(err)
                    }
                    this.onProgress.next({ status: 'Sent' })
                    setTimeout(() => resolve(res), 2000)
                    // return resolve(res)
                }
            )
        })
    }
    allowance(owner, spender) {
        return this.contract.methods.allowance(owner, spender).call()
    }
    depositTokenForV1(privateKey, balance, vetAddress) {
        return this.depositToken(privateKey, false, balance, vetAddress)
    }
    depositTokenForV2(privateKey, balance, vetAddress) {
        return this.depositToken(privateKey, true, balance, vetAddress)
    }

    balanceOf(address) {
        return this.contract.methods.balanceOf(address).call({
            from: this.web3.eth.defaultAccount.address
        })
    }
}
