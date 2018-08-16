import BaseContract from './BaseContract'

const constants = require('../../Constants')
const ethAbi = require('web3-eth-abi')
const ContractAbi = require('../../Base/Contracts/DBETV1TokenMock.json')
const VET_DEPOSIT_ADDR = '0x9e1aC8918a44aFFa9d60df7aEBcd4C5FEcf09167'

const CONTRACT_ADDR = '0xdCCEADC8821B7932fC533330A98c5b6F5A1e6dfB'
let network = 4
export default class DBETV1TokenMockContract extends BaseContract {
    constructor(web3) {
        super(web3)
        this.listener = null
        this.contract = new web3.eth.Contract(ContractAbi.abi, CONTRACT_ADDR)
    }

    allowance(owner, spender) {
        return this.contract.methods.allowance(owner, spender).call()
    }
    approve(privateKey, value) {
        return new  Promise((resolve, reject) => {
            let encodedFunctionCall = ethAbi.encodeFunctionCall({
                name: 'approve',
                type: 'function',
                inputs: [{
                    type: 'address',
                    name: '_spender'
                    },
                    {
                        type: 'uint256',
                        name: '_value'
                    }
                ]
            }, [VET_DEPOSIT_ADDR, value])
            this.signAndSendRawTransaction(privateKey, CONTRACT_ADDR, null,
                100000, encodedFunctionCall, (err, res) => {
                    if (err) {
                        reject(err)
                    }
                    return resolve(res)
                })
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
            CONTRACT_ADDR,
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
            CONTRACT_ADDR,
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
            from: window.web3Object.eth.defaultAccount.address
        })
    }
}
