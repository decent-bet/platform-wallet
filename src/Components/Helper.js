/**
 * Created by user on 9/7/2017.
 */

import React from 'react'

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
        return Math.round(new Date().getTime()/1000)
    }

}

export default Helper