import BaseContract from './BaseContract'
import { DBET_VET_TOKEN_ADDRESS } from '../../Constants'
import { BigNumber } from 'bignumber.js'
import Helper from '../../Helper'

const helper = new Helper()
const Contract_DBETVETToken = require('../../Base/Contracts/DBETVETToken.json')

export default class DBETVETTokenContract extends BaseContract {
    constructor(web3, thor) {
        super(web3)
        this.listener = null
        this.thor = thor
        this.contract = new thor.eth.Contract(
            Contract_DBETVETToken.abi,
            DBET_VET_TOKEN_ADDRESS
        )
    }

    balanceOf(address) {
        return this.contract.methods.balanceOf(address).call({
            from: this.thor.eth.defaultAccount
        })
    }

    async getEstimateTransferGas(amount) {
        const callObj = this.contract.methods.transfer(
            DBET_VET_TOKEN_ADDRESS,
            amount || 10
        )
        return await this.thor.eth.estimateGas(callObj)
    }

    async transfer(privateKey, address, value, gasPrice, gas) {
        const encodedFunctionCall = this.contract.methods
            .transfer(address, value)
            .encodeABI()

        return await this.thorify_signAndSendRawTransaction(
            privateKey,
            DBET_VET_TOKEN_ADDRESS,
            parseInt(gasPrice, 10),
            null,
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
    async thorify_signAndSendRawTransaction(
        privateKey,
        to,
        gasPriceCoef,
        gas,
        data
    ) {
        if (!gasPriceCoef) gasPriceCoef = 0

        //check the gas
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
            let signed = await this.thor.eth.accounts.signTransaction(
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

    async getTransactionLogs() {
        const logs = await this.contract.getPastEvents({
            topics: null,
            order: 'ASC'
        })
        const items = logs
            .filter(
                i =>
                    !!i.event &&
                    (i.returnValues.to === this.thor.eth.defaultAccount ||
                        i.returnValues.from === this.thor.eth.defaultAccount)
            )
            .map(tx => {
                const { blockTimestamp } = tx.meta
                const { from, to, value } = tx.returnValues
                let amount = helper.formatDbets(new BigNumber(value))
                let timestamp = new BigNumber(blockTimestamp)
                let newTx = {
                    isVET: true,
                    block: {
                        timestamp,
                        number: tx.blockNumber
                    },
                    hash: tx.transactionHash,
                    from: from.toLowerCase(),
                    to: to.toLowerCase(),
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
