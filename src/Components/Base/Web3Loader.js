/* global web3 */
/**
 *  NOTE: DO NOT remove the line above. ESLint will throw undef errors if this line is removed since web3 is injected
 *  from MetaMask and ESLint does not detect externally defined global variables while compiling.
 *
 * */

import EventBus from 'eventing-bus'

import KeyHandler from './KeyHandler'
import ContractHelper from '../ContractHelper'
import ChainInterface from 'chain-interface'

const keyHandler = new KeyHandler()

let accounts

let initWeb3 = () => {
    if (keyHandler.isLoggedIn()) {
        window.web3Object = ChainInterface.Web3Wrapper.getWeb3(keyHandler.getCurrency())
        window.web3Object.eth.defaultAccount = keyHandler.getAddress()

        accounts = window.web3Object.eth.accounts
        const contractHelper = new ContractHelper()
        contractHelper.getAllContracts((err, token) => {
            console.log('Web3Loader: getAllContracts: ', err, window.web3Object.eth.defaultAccount, window.web3Object.eth.accounts[0])
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