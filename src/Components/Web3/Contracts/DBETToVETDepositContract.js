import BaseContract from './BaseContract'

const ethAbi = require('web3-eth-abi')
const Contract_DBETToVETDeposit = require('../../Base/Contracts/DBETToVETDeposit.json')

const VET_DEPOSIT_ADDR = '0x9e1aC8918a44aFFa9d60df7aEBcd4C5FEcf09167'
let network = 4
export default class DBETToVETDepositContract  extends BaseContract {
    constructor(web3) {
        super(web3)
        this.listener = null
        this.contract = new web3.eth.Contract(Contract_DBETToVETDeposit.abi, VET_DEPOSIT_ADDR)
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
