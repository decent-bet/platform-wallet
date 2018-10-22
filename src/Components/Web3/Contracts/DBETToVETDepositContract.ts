/* eslint-disable no-console */
import BaseContract from './BaseContract'
import { BigNumber } from 'bignumber.js'
import { Subject, Observable } from 'rxjs'
import { timeout, filter, catchError, tap } from 'rxjs/operators'
import { Config } from '../../Config'
import Helper from '../../Helper'
import Web3 from 'web3'
import { VETDeposit } from './Deposit'
import Contract from 'web3/eth/contract'

const ethAbi = require('web3-eth-abi')
const Contract_DBETToVETDeposit = require('../../Base/Contracts/DBETToVETDeposit.json')
const contracts = require('@decent-bet/contract-migration')

const helper = new Helper()
const WATCH_DEPOSIT_TIMEOUT = 9 * 60000
export default class DBETToVETDepositContract extends BaseContract {
    private contract: Contract
    private senderContract: any
    private onProgress: Subject<any>

    constructor(web3: Web3, thor: Web3) {
        super(web3)
        this.contract = new web3.eth.Contract(
            Contract_DBETToVETDeposit.abi,
            Config.depositAddress
        )

        const SENDER_CONTRACT_ADDRESS = contracts.DBETVETToken.address[Config.chainTag]

        this.senderContract = new thor.eth.Contract(
            contracts.DBETVETToken.raw.abi,
            SENDER_CONTRACT_ADDRESS
        )
        this.onProgress = new Subject()
    }

    public watchForDeposits(
        checkV1Deposit,
        checkV2Deposit,
        onDepositCompleted
    ) {
        return new Promise((resolve, reject) => {
            let message = 'Waiting for token deposit...'
            this.onProgress.next({ status: message })
            console.log(message)

            // Watch 12 - block headers
            let grantSubscription
            let block = 0
            let blockHeaderSubscription
            blockHeaderSubscription = this.onNewBlockHeaders$()
                .pipe(
                    tap(blockHeader => {
                        if (block === 0) {
                            block = blockHeader.number
                        }
                    })
                )
                .subscribe(blockHeader =>
                    this.onBlockHeader(blockHeader, block, () => {
                        blockHeaderSubscription.unsubscribe()
                        if (grantSubscription) {
                            grantSubscription.unsubscribe()
                        }

                        resolve(true)
                    })
                )

            let lookup: number[] = []
            let pending = 0

            this.logTokenDeposit$()
                .pipe(
                    filter(item => {
                        // Remove filter post release
                        const { index } = item.returnValues
                        console.log(`Deposit completed, index ${index}`)
                        this.onProgress.next({
                            status: `Deposit completed, index ${index}`,
                            data: index
                        })
                        return true
                    }),
                    tap(i => {
                        const {
                            index,
                            _address,
                            amount,
                            VETAddress
                        } = i.returnValues
                        console.log(`Deposit completed, index ${index}`)
                        this.onProgress.next({
                            status: `Deposit completed, index ${index}`,
                            data: index
                        })

                        let value = helper.formatDbets(new BigNumber(amount))
                        let newTx = {
                            isVET: false,
                            hash: i.transactionHash,
                            from: _address.toLowerCase(),
                            to: VETAddress.toLowerCase(),
                            value
                        }
                        onDepositCompleted(newTx)
                        message = 'Waiting for token grant...'
                        this.onProgress.next({ status: message })
                        console.log(message)
                    }),
                    timeout(WATCH_DEPOSIT_TIMEOUT),
                    catchError(error => {
                        reject(error)
                        return error
                    })
                )
                .subscribe(i => {
                    const { index } = (i as any).returnValues
                    lookup = [...lookup, parseInt(index, 10)]
                    pending++
                    if (grantSubscription) return

                    grantSubscription = this.pollLogGrantTokens$().subscribe(
                        (item: any) => {
                            const idx = parseInt(item.returnValues.index, 10)
                            if (lookup.includes(idx)) {
                                this.onProgress.next({
                                    status: 'Grant completed',
                                    data: index
                                })
                                console.log('Token grant completed')
                                pending--
                                if (pending === 0) {
                                    blockHeaderSubscription.unsubscribe()
                                    grantSubscription.unsubscribe()

                                    resolve(true)
                                }
                            }
                        }
                    )
                }, reject)
        })
    }

    public pollLogGrantTokens$() {
        const listener = this.senderContract.events.LogGrantTokens(
            undefined,
            () => {}
        )
        return this.fromEmitter(listener)
    }

    public logTokenDeposit$() {
        const listener = this.contract.events.LogTokenDeposit(
            undefined,
            () => {}
        )
        return this.fromEmitter(listener)
    }

    public depositToken(deposit: VETDeposit) {
        return new Promise((resolve, reject) => {
            const { isV2, balance, vetAddress, privateKey } = deposit
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
                Config.depositAddress,
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
    public allowance(owner, spender) {
        return this.contract.methods.allowance(owner, spender).call()
    }

    public balanceOf(address) {
        return this.contract.methods.balanceOf(address).call({
            from: (this.web3.eth.defaultAccount as any).address
        })
    }

    private onBlockHeader(blockHeader, from, callback) {
        const counter = blockHeader.number - from
        if (counter > 25) {
            this.onProgress.next({ status: 'Pending' })
            console.log(
                'Set to pending after no match found in more than 12 blocks'
            )
            callback()
        }
    }

    private onNewBlockHeaders$(): Observable<any> {
        return this.fromEmitter(
            this.web3.eth.subscribe('newBlockHeaders', () => {})
        )
    }
}
