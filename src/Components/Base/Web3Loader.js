/**
 *  NOTE: DO NOT remove the line above. ESLint will throw undef errors if this line is removed since web3 is injected
 *  from MetaMask and ESLint does not detect externally defined global variables while compiling.
 *
 * */
import KeyHandler from './KeyHandler'
import ContractHelper from '../Web3/ContractHelper'
import EventBus from 'eventing-bus'
import Web3 from 'web3'
const thorify = require('thorify').thorify

const WebsocketProvider = require('web3-providers-ws')
const constants = require('../Constants')
const keyHandler = new KeyHandler()


let initWeb3 = async () => {
    const httpProvider = constants.PROVIDER_URL

    let provider = new WebsocketProvider(httpProvider)

    window.web3Object = new Web3(provider)
    window.thor = thorify(
        new Web3(),
        process.env.THOR_URL || constants.THOR_URL
    )

    const contractHelper = new ContractHelper(window.web3Object, window.thor)
    window.contractHelper = contractHelper
    window.web3Loaded = true
    EventBus.publish('web3Loaded')
}

class Web3Loader {
    constructor() {
        initWeb3()
    }

    init() {
        this.setDefaultAccounts()
    }

    setDefaultAccounts() {
        if (keyHandler.isLoggedIn()) {
            window.web3Object.eth.defaultAccount = keyHandler.getAddress()
            // eslint-disable-next-line
            console.log(
                'window.web3Object.eth.defaultAccount',
                window.web3Object.eth.defaultAccount
            )
            window.thor.eth.defaultAccount = keyHandler.getAddress().toLowerCase()
        }
    }
}

export default Web3Loader
