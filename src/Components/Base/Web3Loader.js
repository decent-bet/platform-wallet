/**
 *  NOTE: DO NOT remove the line above. ESLint will throw undef errors if this line is removed since web3 is injected
 *  from MetaMask and ESLint does not detect externally defined global variables while compiling.
 *
 * */
import KeyHandler from './KeyHandler'
import ContractHelper from '../Web3/ContractHelper'
import EventBus from 'eventing-bus'
import Web3 from 'web3'
import { Config } from '../Config'
const thorify = require('thorify').thorify

const keyHandler = new KeyHandler()


let initWeb3 = async () => {    
    window.thor = thorify(
        new Web3(),
        process.env.THOR_URL || Config.thorUrl
    )

    window.thor.currentProvider.on('data', e => {
        console.log(e)
    })


    const contractHelper = new ContractHelper(window.thor)
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
            window.thor.eth.defaultAccount = keyHandler.getPubAddress().toLowerCase()
        }
    }
}

export default Web3Loader
