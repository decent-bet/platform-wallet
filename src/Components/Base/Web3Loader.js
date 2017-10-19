/* global web3 */
/**
 *  NOTE: DO NOT remove the line above. ESLint will throw undef errors if this line is removed since web3 is injected
 *  from MetaMask and ESLint does not detect externally defined global variables while compiling.
 *
 * */

import EventBus from 'eventing-bus'
import Web3 from 'web3'

import KeyHandler from './KeyHandler'
const keyHandler = new KeyHandler()

import ContractHelper from '../ContractHelper'

const Accounts = require('web3-eth-accounts')
let accounts

let initWeb3 = () => {
    let httpProvider = keyHandler.loadNetworkProvider()
    httpProvider = httpProvider != null ? httpProvider : 'https://mainnet.infura.io/yBQKYV53pkKnCuok9uYK'
    accounts = new Accounts(httpProvider)

    let provider = new Web3.providers.HttpProvider(httpProvider)
    let defaultAccount

    if (keyHandler.isLoggedIn())
        defaultAccount = accounts.privateKeyToAccount(keyHandler.get())

    window.web3Object = new Web3(provider)
    if (defaultAccount)
        window.web3Object.eth.defaultAccount = defaultAccount.address
    console.log('window.web3Object.eth.defaultAccount', window.web3Object.eth.defaultAccount)

    const contractHelper = new ContractHelper()
    contractHelper.getAllContracts((err, token) => {
        console.log('getAllContracts: ', err, window.web3Object.eth.defaultAccount, window.web3Object.eth.accounts[0])
        window.contractHelper = contractHelper
        EventBus.publish('web3Loaded')
    })
}

class Web3Loader {

    constructor() {
        initWeb3()
    }

}

export default Web3Loader