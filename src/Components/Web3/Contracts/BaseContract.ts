/* eslint-disable no-console */
import { NonceHandler } from '../NonceHandler'
import EthAccounts from 'web3-eth-accounts'
import { Observable } from 'rxjs'
import Web3 from 'web3';
import { Config } from '../../Config'

const ethAccounts = new EthAccounts(Config.gethUrl)
const nonceHandler = new NonceHandler()
export default class BaseContract {
    /**
     * Builds the contract
     * @param {Web3} web3
     */
    constructor(protected web3: Web3) {
        this.web3 = web3
        // this.contract = new this.web3.eth.Contract(this.json.abi)

        // // Dirty hack for web3@1.0.0 support for localhost testrpc,
        // // see https://github.com/trufflesuite/truffle-contract/issues/56#issuecomment-331084530
        // if (typeof web3.currentProvider.sendAsync !== 'function') {
        //     web3.currentProvider.sendAsync = function() {
        //         return web3.currentProvider.send.apply(
        //             web3.currentProvider,
        //             arguments
        //         )
        //     }
        // }
    }


    /**
     * Get logs using getPastEvents and merge timestamp from getBlock
     */
    public async getLogs(contract, eventName, filter) {
        const logs = await contract.getPastEvents(eventName ? eventName : null, {
            fromBlock: 0,
            toBlock: 'latest',
            filter,
            order: 'DESC',
            options: { offset: 0 }
        }, () => {})

        const withTimestamp = logs.map(async (i) => {
            const block = await this.web3.eth.getBlock(i.blockNumber)
            return {
                ...i,
                timestamp: block.timestamp,
            }
        })

        return Promise.all(withTimestamp)
    }

    public fromEmitter(emitter): Observable<any> {
        return Observable.create(observer => {
            emitter.on('data', i => observer.next(i))
            emitter.on('error', e => observer.error(e))
        })
    }
    public signAndSendRawTransaction = (
        privateKey,
        to,
        gasPrice,
        gas,
        data,
        callback
    ) => {
        this.web3.eth.getTransactionCount(
            this.web3.eth.defaultAccount,
            'latest',
            (err, count) => {
                console.log('Tx count', err, count)

                if (!err) {
                    let nonce = nonceHandler.get(count)

                    let tx = {
                        from: this.web3.eth.defaultAccount,
                        to,
                        gas,
                        gasPrice: 0,                        
                        data,
                        nonce
                    }

                    /** If not set, it'll be automatically pulled from the Ethereum network */
                    if (gasPrice) tx.gasPrice = gasPrice
                    else tx.gasPrice = 10000000000

                    console.log(tx)
                    ethAccounts.signTransaction(tx, privateKey, (err, res) => {
                        console.log(
                            'Signed raw tx',
                            err,
                            res ? res.rawTransaction : ''
                        )
                        if (!err) {
                            nonceHandler.set(nonce)
                            this.web3.eth.sendSignedTransaction(
                                res.rawTransaction,
                                callback
                            )
                        } else {
                            callback(true, 'Error signing transaction')
                        }
                    })
                } else callback(true, 'Error retrieving nonce')
            }
        )
    }
}
