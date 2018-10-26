import BaseContract from './BaseContract'
import { Config } from '../../Config'
import { BigNumber } from 'bignumber.js'
import Helper from '../../Helper'
import Web3 from 'web3';
import Contract from 'web3/eth/contract';
const helper = new Helper()
const Contract_DBETVETToken = require('../../Base/Contracts/DBETVETToken.json')

export default class DBETVETTokenContract extends BaseContract {
    protected contract: Contract;
    constructor(web3: Web3, private thor: Web3) {
        super(web3)
        this.thor = thor
        this.contract = new thor.eth.Contract(
            Contract_DBETVETToken.abi,
            Config.vetTokenAddress
        )
    }

    public getEnergy(address) {
        return this.contract.methods.getEnergy(address).call({
            from: this.thor.eth.defaultAccount
        })
    }

    
    public balanceOf(address) {
        return this.contract.methods.balanceOf(address).call({
            from: this.thor.eth.defaultAccount
        })
    }

    public async getEstimateTransferGas(amount) {
        const callObj: any = this.contract.methods.transfer(
            Config.vetTokenAddress,
            amount || 10
        )
        return await this.thor.eth.estimateGas(callObj)
    }

    public async transfer(privateKey, address, value, gasPrice, gas) {
        const encodedFunctionCall = this.contract.methods
            .transfer(address, value)
            .encodeABI()

        return await this.thorify_signAndSendRawTransaction(
            privateKey,
            Config.vetTokenAddress,
            null,    
            parseInt(gasPrice, 10),
            encodedFunctionCall
        )
    }

    /**
     * Takes the encoded function, signs it and sends it to
     * the ethereum network
     * @param {String} privateKey
     * @param {String} to
     * @param {Number} gasPriceCoef
     * @param {Number} gas
     * @param {String} data
     */
    public async thorify_signAndSendRawTransaction(
        privateKey,
        to,
        gasPriceCoef,
        gas,
        data
    ) {
        if (!gasPriceCoef) gasPriceCoef = 0

        // check the gas
        if (!gas || gas < 0) {
            gas = 2000000
        }

        let txBody = {
            from: this.thor.eth.defaultAccount,
            to,
            gas,
            data,
            gasPriceCoef
        }

        // eslint-disable-next-line
        console.log('signAndSendRawTransaction - txBody:', txBody)

        try {
            let signed: any = await this.thor.eth.accounts.signTransaction(
                txBody,
                privateKey
            )
            let promiseEvent = this.thor.eth.sendSignedTransaction(
                signed.rawTransaction
            )
            return promiseEvent
        } catch (error) {
            // eslint-disable-next-line
            console.error('Error on signAndSendRawTransaction', error.message)
            return null
        }
    }

    public async getTransactionLogs(vetAddress) {
        const logs = await this.contract.getPastEvents({
            topics: null,
            order: 'ASC'
        } as any)
        const items = logs
            .filter(
                i =>
                    !!i.event &&
                    (i.returnValues.to === vetAddress ||
                        i.returnValues.from === vetAddress)
            )
            .map((tx: any) => {
                const { blockTimestamp } = tx.meta
                let { from, to, value } = tx.returnValues
                let amount = helper.formatDbets(new BigNumber(value))
                let timestamp = new BigNumber(blockTimestamp)
                let newTx = {
                    evt: tx.event,
                    isVET: true,
                    block: {
                        timestamp,
                        number: tx.blockNumber
                    },
                    hash: tx.transactionHash,
                    from: from.toLowerCase(),
                    to: to.toLowerCase(),
                    isUpgrade: tx.address === Config.vetTokenAddress,
                    value: amount
                }

                return newTx
            })

        const txs = {}
        items.forEach(i => {
            txs[i.hash] = {
                ...i
            }
        })

        return txs
    }
}
