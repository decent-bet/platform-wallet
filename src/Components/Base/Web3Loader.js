/* global web3 */
/**
 *  NOTE: DO NOT remove the line above. ESLint will throw undef errors if this line is removed since web3 is injected
 *  from MetaMask and ESLint does not detect externally defined global variables while compiling.
 *
 * */

import EventBus from 'eventing-bus'

import KeyHandler from './KeyHandler'
import ContractHelper from '../ContractHelper'
import {thorify} from "thorify"

const Web3 = require("web3") // Thorify recommends using require() instead of import here

const constants = require('../Constants')
const keyHandler = new KeyHandler()

let accounts

let initWeb3 = () => {
    if (keyHandler.isLoggedIn()) {
        const currency = keyHandler.getCurrency()
        console.log('Web3Loader: Detected currency ' + currency)
        if (currency === 'VET') {  //if they are logged in to a VET-based address, set the web3 object as such
            let providerVET = new Web3.providers.HttpProvider(constants.PROVIDER_URL_VET)
            // TODO: do I pass providerVET in Web3 constructor also?
            // (Thorify docs only indicate passing string url for second param)
            window.web3Object = thorify(new Web3(), constants.PROVIDER_URL_VET) //set the default web3 object to Thorified
            // But also expose the standard web3 interface via web3ObjectDefault
            // TODO: is there even value in exposing both?
            window.web3ObjectDefault = new Web3(providerVET) //TODO: is this right? use the VET provider URL?
        } else {
            window.web3Object = new Web3(new Web3.providers.HttpProvider(constants.PROVIDER_URL_ETH))
        }
        accounts = window.web3Object.eth.accounts
        console.log('Web3Loader: window.web3Object.eth.accounts', accounts)
        window.web3Object.eth.defaultAccount = keyHandler.getAddress()
        console.log('Web3Loader: window.web3Object.eth.defaultAccount', window.web3Object.eth.defaultAccount)
    }

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