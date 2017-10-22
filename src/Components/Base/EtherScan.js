const request = require('request')

const constants = require('../Constants')

const BASE_URL = 'https://api.etherscan.io/api'
const CONTRACT_ADDRESS = '0x540449e4d172cd9491c76320440cd74933d5691a'
const CONTRACT_STARTING_BLOCK = 4302822

const TRANSFER_EVENT_SIGNATURE = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

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
                err = true
            }
            callback(err, body)
        })
    }

    /**
     * Retrieves all transfer events from/to the logged in address
     * https://etherscan.io/apis#logs
     * @param isFrom
     * @param callback
     */
    getTransferLogs = (isFrom, callback) => {
        let params = {
            module: 'logs',
            action: 'getLogs',
            fromBlock: CONTRACT_STARTING_BLOCK,
            toBlock: 'latest',
            address: CONTRACT_ADDRESS,
            topic0: TRANSFER_EVENT_SIGNATURE,
            apikey: constants.ETHERSCAN_API_KEY
        }
        params[isFrom ? 'topic1' : 'topic2'] = this._formatAddress(window.web3Object.eth.defaultAccount)

        this.get(params, callback)
    }

    _formatAddress = (address) => {
        return address.replace('0x', '0x000000000000000000000000')
    }

    _unformatAddress = (address) => {
        return address.replace('0x000000000000000000000000', '0x')
    }

}

export default EtherScan