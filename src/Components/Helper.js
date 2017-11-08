const constants = require('./Constants')

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

    formatEther = (value) => {
        return parseFloat(this.getWeb3().fromWei(value.toString())).toFixed(6)
    }

    formatNumber = (value) => {
        return Number(parseFloat(value).toFixed(2)).toLocaleString('en', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })
    }

    getSelectedTokenContract = () => {
        return localStorage.getItem(constants.LS_KEY_SELECTED_TOKEN_CONTRACT) != null ?
            localStorage.getItem(constants.LS_KEY_SELECTED_TOKEN_CONTRACT) :
            constants.TOKEN_TYPE_DBET_TOKEN_NEW
    }

    setSelectedTokenContract = (type) => {
        localStorage.setItem(constants.LS_KEY_SELECTED_TOKEN_CONTRACT, type)
    }

    isElectron = () => {
        return window && window.process && window.process.type
    }

    openUrl = (url) => {
        if (this.isElectron())
            window.require('electron').shell.openExternal(url)
        else
            window.open(url, '_blank')
    }

}

export default Helper