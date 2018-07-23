/* global web3 */
/**
 *  NOTE: DO NOT remove the line above. ESLint will throw undef errors if this line is removed since web3 is injected
 *  from MetaMask and ESLint does not detect externally defined global variables while compiling.
 *
 * */
const constants = require('../Constants')
import EventBus from 'eventing-bus'
import { thorify } from "thorify";
const Web3 = require("web3");
const web3 = thorify(new Web3(), constants.PROVIDER_URL_ETH); //TODO: do I need to write a compatibility wrapper here?

import KeyHandler from './KeyHandler'
import ContractHelper from '../ContractHelper'

const keyHandler = new KeyHandler()

const Accounts = web3.eth.accounts
let accounts

let initWeb3 = () => {
    const httpProvider = constants.PROVIDER_URL_ETH
    accounts = new Accounts(httpProvider)

    let provider = new Web3.providers.HttpProvider(httpProvider)

    window.web3Object = web3
    if (keyHandler.isLoggedIn())
        window.web3Object.eth.defaultAccount = keyHandler.getAddress()
    console.log('window.web3Object.eth.defaultAccount', window.web3Object.eth.defaultAccount)

    const contractHelper = new ContractHelper()
    contractHelper.getAllContracts((err, token) => {
        console.log('getAllContracts: ', err, window.web3Object.eth.defaultAccount, window.web3Object.eth.accounts[0])
        window.contractHelper = contractHelper
        window.web3Loaded = true
        EventBus.publish('web3Loaded')
    })
}

class Web3Loader {

    constructor() {
        initWeb3()
    }

    init() {
        initWeb3()
    }

}

export default Web3Loader