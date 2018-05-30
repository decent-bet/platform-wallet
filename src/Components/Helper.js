const constants = require('./Constants')

class Helper {

    getMainnetWeb3 = () => {
        return window.web3Object.mainnet
    }

    getDevWeb3 = () => {
        return window.web3Object.dev
    }

    getContractHelper = () => {
        return window.contractHelper
    }

    getTimestamp = () => {
        return parseInt(new Date().getTime() / 1000)
    }

    formatDbets = (value) => {
        return parseFloat(this.getMainnetWeb3().fromWei(value.toString())).toFixed(2)
    }

    formatEther = (value) => {
        return parseFloat(this.getMainnetWeb3().fromWei(value.toString())).toFixed(6)
    }

    formatDbetsMax = (value) => {
        return this.getMainnetWeb3().fromWei(value.toString(), 'ether')
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

    formatAddress = (address) => {
        return address === '0x0000000000000000000000000000000000000000' ?
            'DBET Token Contract' : address
    }

    fetchHouseAllowance = async () => {
        try {
            return this
                .getContractHelper()
                .getWrappers()
                .testDecentBetToken()
                .allowance(
                    this.getDevWeb3().eth.defaultAccount,
                    this.getContractHelper().getTestDecentBetTokenInstance().address
                )
        } catch (err) {
            console.log('Error retrieving house allowance', err.message)
        }
    }



      executePurchaseCredits = async (amount) => {
        try {
            return this
                .getContractHelper()
                .getWrappers()
                .house()
                .purchaseCredits(amount)
        } catch (err) {
            console.log('Error sending purchase credits tx', err.message)
        }
    }

}

export default Helper
