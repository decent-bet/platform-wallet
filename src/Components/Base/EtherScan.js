const request = require('request')

import Helper from '../Helper'

const constants = require('../Constants')
const contracts = require('./contracts.json')
const helper = new Helper()

const BASE_URL = 'https://api.etherscan.io/api'

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
            fromBlock: this._getSelectedContract().startBlock,
            toBlock: 'latest',
            address: this._getSelectedContract().address,
            topic0: TRANSFER_EVENT_SIGNATURE
        }
        params[isFrom ? 'topic1' : 'topic2'] = this._formatAddress(window.web3Object.mainnet.eth.defaultAccount)

        this.get(params, callback)
    }

    _getSelectedContract = () => {
        return helper.getSelectedTokenContract() == constants.TOKEN_TYPE_DBET_TOKEN_NEW ?
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