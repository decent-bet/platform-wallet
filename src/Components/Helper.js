/**
 * Created by user on 9/7/2017.
 */

import React from 'react'

const constants = require('./Constants')
const ethUnits = require('ethereum-units')

const IS_DEV = true

class Helper {

    isDev = () => {
        return IS_DEV
    }

    getWeb3 = () => {
        return window.web3
    }

    getContractHelper = () => {
        return window.contractHelper
    }

    Htmlify(html) {
        return <div dangerouslySetInnerHTML={{__html: html}}></div>;
    }

    getEtherInWei = () => {
        return ethUnits.units.ether
    }

    formatEther = (ether) => {
        return ether / this.getEtherInWei()
    }

    roundDecimals = (number, decimals) => {
        let multiplier = 10 ^ decimals
        return Math.round(number * multiplier) / multiplier
    }

    getTimestamp = () => {
        return Math.round(new Date().getTime() / 1000)
    }

    getEthereumNetwork = (network) => {
        switch (network) {
            case constants.ETHEREUM_NETWORK_LOADING:
                return "Loading.."
            case constants.ETHEREUM_NETWORK_MAINNET:
                return 'Ethereum Mainnet'
            case constants.ETHEREUM_NETWORK_MORDEN:
                return 'Morden testnet'
            case constants.ETHEREUM_NETWORK_ROPSTEN:
                return 'Ropsten testnet'
            case constants.ETHEREUM_NETWORK_RINKEBY:
                return 'Rinkeby testnet'
            case constants.ETHEREUM_NETWORK_KOVAN:
                return 'Kovan testnet'
            default:
                return 'Private test network'
        }
    }

    getEthereumProvider = (network) => {
        switch (network) {
            case constants.ETHEREUM_NETWORK_MAINNET:
                return constants.ETHEREUM_PROVIDER_MAINNET
            case constants.ETHEREUM_NETWORK_MORDEN:
                return constants.ETHEREUM_PROVIDER_MORDEN
            case constants.ETHEREUM_NETWORK_ROPSTEN:
                return constants.ETHEREUM_PROVIDER_ROPSTEN
            case constants.ETHEREUM_NETWORK_RINKEBY:
                return constants.ETHEREUM_PROVIDER_RINKEBY
            case constants.ETHEREUM_NETWORK_KOVAN:
                return constants.ETHEREUM_PROVIDER_KOVAN
            default:
                return null
        }
    }

}

export default Helper