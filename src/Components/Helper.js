import React from 'react'

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

    formatNumber = (value) => {
        return Number(parseFloat(value).toFixed(2)).toLocaleString('en', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })
    }

}

export default Helper