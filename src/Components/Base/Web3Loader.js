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

let initWeb3 = () => {
    const providerUrls = {
        mainnet: constants.PROVIDER_MAINNET_URL,
        dev: constants.PROVIDER_DEV_URL,
    }

    const providers = {
        mainnet: new Web3.providers.HttpProvider(providerUrls.mainnet),
        dev: new Web3.providers.HttpProvider(providerUrls.dev)
    }

    window.web3Object = {
        mainnet: new Web3(providers.mainnet),
        dev: new Web3(providers.dev)
    }
    if (keyHandler.isLoggedIn()) {
        window.web3Object.mainnet.eth.defaultAccount = keyHandler.getAddress()
        window.web3Object.dev.eth.defaultAccount = keyHandler.getAddress()
    }
    console.log('window.web3Object.eth.defaultAccount', window.web3Object.mainnet.eth.defaultAccount)

    const contractHelper = new ContractHelper()
    contractHelper.getAllContracts((err, token) => {
        console.log('getAllContracts: ',
            err,
            window.web3Object.mainnet.eth.defaultAccount,
            window.web3Object.mainnet.eth.accounts[0]
        )
        window.contractHelper = contractHelper
        window.web3Loaded = true
        EventBus.publish('web3Loaded')
    })
}

class Web3Loader {

    constructor() {
    }

    init() {
        initWeb3()
    }

}

export default Web3Loader
