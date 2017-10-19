/**
 * Created by user on 9/7/2017.
 */

import React from 'react'

const constants = require('./Constants')
const ethUnits = require('ethereum-units')

class Helper {

    getWeb3 = () => {
        return window.web3Object
    }

    getContractHelper = () => {
        return window.contractHelper
    }

    formatDbets = (value) => {
        return parseFloat(this.getWeb3().fromWei(value.toString())).toFixed(2)
    }

}

export default Helper