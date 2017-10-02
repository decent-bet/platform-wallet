/* global web3 */
/**
 *  NOTE: DO NOT remove the line above. ESLint will throw undef errors if this line is removed since web3 is injected
 *  from MetaMask and ESLint does not detect externally defined global variables while compiling.
 *
 * */

import Web3 from 'web3'

const Accounts = require('web3-eth-accounts')
let accounts

import KeyHandler from './KeyHandler'
const keyHandler = new KeyHandler()

import ContractHelper from '../ContractHelper'

let callback

let initWeb3 = () => {
    let httpProvider = keyHandler.loadNetworkProvider()
    httpProvider = httpProvider != null ? httpProvider : 'https://mainnet.infura.io/yBQKYV53pkKnCuok9uYK'
    accounts = new Accounts(httpProvider)

    let provider = new Web3.providers.HttpProvider(httpProvider)
    let defaultAccount

    if (keyHandler.isLoggedIn()) {
        defaultAccount = accounts.privateKeyToAccount(keyHandler.get())
        console.log('Logged in', defaultAccount.address)
    }

    window.web3 = new Web3(provider)
    window.web3.eth.defaultAccount = defaultAccount

    const contractHelper = new ContractHelper()

    contractHelper.getAllContracts((err, token) => {
        console.log('getAllContracts: ', err, token.address, window.web3.eth.defaultAccount, window.web3.eth.accounts[0])
        window.contractHelper = contractHelper
        if (callback)
            callback()
    })
}

window.addEventListener('load', function () {
    initWeb3()
})

class Web3Loader {

    setOnLoadWeb3Listener = (_callback) => {
        callback = _callback
    }

}

export default Web3Loader