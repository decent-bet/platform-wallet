import BaseContract from './BaseContract'
import { Observable, pipe } from 'rxjs'
import { timeout, filter } from 'rxjs/operators'
const ethAbi = require('web3-eth-abi')
const Contract_DBETToVETDeposit = require('../../Base/Contracts/DBETToVETDeposit.json')
const Contract_DBETVETToken = require('../../Base/Contracts/DBETVETToken.json')

const VET_DEPOSIT_ADDR = '0x9e1aC8918a44aFFa9d60df7aEBcd4C5FEcf09167'
const VET_SENDER_ADDR = '0x944369570958a9b6d67f574e57cfa830fdc881ee'
let network = 4
export default class DBETToVETDepositContract extends BaseContract {
    constructor(web3, thor) {
        super(web3)
        this.listener = null
        this.contract = new web3.eth.Contract(
            Contract_DBETToVETDeposit.abi,
            VET_DEPOSIT_ADDR
        )
        this.senderContract = new thor.eth.Contract(
            Contract_DBETVETToken.abi,
            VET_SENDER_ADDR
        )
    }

    watchForDeposits({ hasV2, address, balance }) {
        return new Promise((resolve, reject) => {
            console.log(`Subscribe to LogTokenDeposit`)
            this.logTokenDeposit$()
                 .pipe(
                     filter(item => {
                        const { _address, amount, isV2, index } = item.returnValues
                        if (_address === address && 
                            amount.toString() === balance.toString() &&
                            isV2 === hasV2) {
                            console.log(
                                `LogTokenDeposit match found for index ${index}`
                            )
                            return true
                        }
                        return false
                     }),
                     timeout(30000)
                 )
                 .subscribe(i => {
                        console.log(i)
                        const { index }= i.returnValues
                        // find match
                        console.log(`Subscribe to LogGrantTokens`)
                        this.logGrantTokens$().subscribe(({ returnValues }) => {
                            if (returnValues.index === index) {
                                console.log(
                                    `LogGrantTokens match found for index ${index}`
                                )
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
            this.signAndSendRawTransaction(
                privateKey,
                VET_DEPOSIT_ADDR,
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
