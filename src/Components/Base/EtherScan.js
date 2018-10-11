
import Helper from '../Helper'
const log = require('electron-log');

const request = require('request')
const constants = require('../Constants')
const contracts = require('./contracts.json')
const web3Abi = require('web3-eth-abi')
const hex2dec = require('hex2dec')
const helper = new Helper()

const BASE_URL = 'https://api.etherscan.io/api'

const TRANSFER_EVENT_SIGNATURE = web3Abi.encodeEventSignature('Transfer(address,address,uint256)')
const UPGRADE_EVENT_SIGNATURE = web3Abi.encodeEventSignature('Upgrade(address,address,uint256)')

/**
 * EtherScan API implementation
 * https://etherscan.io/apis
 */
class EtherScan {

    get = (params, callback) => {
        let options = {
            url: BASE_URL,
            method: 'GET',
            qs: params
        }
        request(options, (err, response, body) => {
            try {
                body = JSON.parse(body)
            } catch (e) {
                log.error(`EtherScan.js: Error getting EtherScan: ${e.message}`)
                err = true
            }
            callback(err, body)
        })
    }

    /**
     * Retrieves all transfer events from/to the logged in address
     * https://etherscan.io/apis#logs
     * @param isFrom
     */
    getTransferLogs = (isFrom) => {
        return new Promise((resolve, reject) => {
            let params = {
                module: 'logs',
                action: 'getLogs',
                fromBlock: this._getSelectedContract().startBlock,
                toBlock: 'latest',
                address: this._getSelectedContract().address,
                topic0: TRANSFER_EVENT_SIGNATURE
            }
            params[isFrom ? 'topic1' : 'topic2'] = this._formatAddress(window.web3Object.eth.defaultAccount)

            this.get(params, (err, body) => {
                if(err)
                    reject(err)
                else
                    resolve(body)
            })
        })
    }

    /**
     * Retrieves all upgrade events from the logged in address
     * https://etherscan.io/apis#logs
     */
    getUpgradeLogs = () => {
        return new Promise((resolve, reject) => {
            let params = {
                module: 'logs',
                action: 'getLogs',
                fromBlock: this._getSelectedContract().startBlock,
                toBlock: 'latest',
                address: this._getSelectedContract().address,
                topic0: UPGRADE_EVENT_SIGNATURE,
                topic1: this._formatAddress(window.web3Object.eth.defaultAccount)
            }

            this.get(params, (err, body) => {
                if(err)
                    reject(err)
                else
                    resolve(body)
            })
        })
    }

    formatTransferLogs = logs =>
        logs.map(log => {
            return {
                returnValues: {
                    from: this._unformatAddress(log.topics[1]),
                    to: this._unformatAddress(log.topics[2]),
                    // Use hex2dec since BigNumber.js has issues with input > 53 bits
                    value: hex2dec.hexToDec(log.data)
                },
                transactionHash: log.transactionHash,
                timestamp: hex2dec.hexToDec(log.timeStamp),
                blockNumber: hex2dec.hexToDec(log.blockNumber)
            }
        })


    _getSelectedContract = () => {
        return helper.getSelectedTokenContract() === constants.TOKEN_TYPE_DBET_TOKEN_NEW ?
            contracts.newToken : contracts.oldToken
    }

    _formatAddress = (address) => {
        return address.replace('0x', '0x000000000000000000000000')
    }

    _unformatAddress = (address) => {
        return address.replace('0x000000000000000000000000', '0x')
    }

}

export default EtherScan
