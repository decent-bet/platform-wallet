/* global web3 */
/**
 *  NOTE: DO NOT remove the line above. ESLint will throw undef errors if this line is removed since web3 is injected
 *  from MetaMask and ESLint does not detect externally defined global variables while compiling.
 *
 * */

import EventBus from 'eventing-bus'
import Web3 from 'web3'

import KeyHandler from './KeyHandler'
import ContractHelper from '../ContractHelper'

const constants = require('../Constants')
const keyHandler = new KeyHandler()

class Web3Loader {

    _initWeb3Object = () => {
        window.web3Object = {
            mainnet: new Web3(new Web3.providers.HttpProvider(constants.PROVIDER_MAINNET_URL)),
            dev: new Web3(new Web3.providers.HttpProvider(constants.PROVIDER_DEV_URL)),
        }
    }

    _initDefaultAccounts = () => {
        if (keyHandler.isLoggedIn()) {
            window.web3Object.mainnet.eth.defaultAccount = keyHandler.getAddress()
            window.web3Object.dev.eth.defaultAccount = keyHandler.getAddress()
        }
    }

    _initContracts = () => {
        const contractHelper = new ContractHelper()
        contractHelper.getAllContracts((err, res) => {
            console.log('getAllContracts: ', err, res)
            window.contractHelper = contractHelper
            window.web3Loaded = true
            EventBus.publish('web3Loaded')
        })
    }

    initWeb3 = () => {
        this._initWeb3Object()
        this._initDefaultAccounts()
        this._initContracts()
    }

    init() {
        this.initWeb3()
    }

}

export default Web3Loader
