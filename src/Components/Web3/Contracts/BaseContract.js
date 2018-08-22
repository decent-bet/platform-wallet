import { NonceHandler } from '../NonceHandler'
import EthAccounts from 'web3-eth-accounts'

const constants = require('../../Constants')

const ethAccounts = new EthAccounts(constants.PROVIDER_URL)
const nonceHandler = new NonceHandler()
export default class BaseContract {
    /**
     * Builds the contract
     * @param {Web3} web3
     * @param {JSON} jsonAbi
     */
    constructor(web3, jsonAbi) {
        this.json = jsonAbi
        this.web3 = web3
        // this.contract = new this.web3.eth.Contract(this.json.abi)

        // Dirty hack for web3@1.0.0 support for localhost testrpc,
        // see https://github.com/trufflesuite/truffle-contract/issues/56#issuecomment-331084530
        if (typeof web3.currentProvider.sendAsync !== 'function') {
            web3.currentProvider.sendAsync = function() {
                return web3.currentProvider.send.apply(
                    web3.currentProvider,
                    arguments
                )
            }
        }
    }

    signAndSendRawTransaction = (
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
