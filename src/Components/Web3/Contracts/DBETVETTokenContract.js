import BaseContract from './BaseContract'
import { DBET_VET_TOKEN_ADDRESS } from '../../Constants'
import { BigNumber } from 'bignumber.js'
import Helper from '../../Helper'
import { Observable, pipe } from 'rxjs'
import { timeout, filter, switchMap, catchError } from 'rxjs/operators'

const helper = new Helper()
const Contract_DBETVETToken = require('../../Base/Contracts/DBETVETToken.json')

let network = 4

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
                    block: {
                        timestamp,
                        number: tx.blockNumber
                    },
                    hash: tx.transactionHash,
                    from,
                    to,
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
