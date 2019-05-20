import BigNumber from 'bignumber.js'

const constants = require('./Constants')
const web3utils = require('web3-utils')
class Helper {
    getWeb3 = () => {
        return window.web3Object
    }

    getContractHelper = () => {
        return window.contractHelper
    }

    getTimestamp = () => {
        return parseInt(new Date().getTime() / 1000)
    }

    formatDbets = value => {
        let numberValue = 0
        if (BigNumber.isBigNumber(value)) {
            numberValue = value.toFixed()
        } else {
            numberValue = value.toString()
        }
        const number = new BigNumber(web3utils.fromWei(numberValue))
        return number.toFixed(4)
    }

    formatEther = value => {
        let numberValue = 0
        if (BigNumber.isBigNumber(value)) {
            numberValue = value.toFixed()
        } else {
            numberValue = value.toString()
        }

        const number = new BigNumber(web3utils.fromWei(numberValue))
        return number.toFixed(6)
    }

    formatDbetsMax = value => {
        return web3utils.fromWei(value.toString(), 'ether')
    }

    formatNumber = value => {
        return Number(value).toLocaleString('en', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6
        })
    }

    getSelectedTokenContract = () => {
        return constants.TOKEN_TYPE_DBET_TOKEN_VET;
    }

    setSelectedTokenContract = type => {
        localStorage.setItem(constants.LS_KEY_SELECTED_TOKEN_CONTRACT, type)
    }

    isVETContractSelected = () => {
        return this.getSelectedTokenContract() === constants.TOKEN_TYPE_DBET_TOKEN_VET
    }

    isElectron = () => {
        return window && window.process && window.process.type
    }

    openUrl = url => {
        if (this.isElectron())
            window.require('electron').shell.openExternal(url)
        else window.open(url, '_blank')
    }

    formatAddress = address => {
        return address === '0x0000000000000000000000000000000000000000'
            ? 'DBET Token Contract'
            : address
    }

    flattenNestedArray = arr => {
        let _arr = []
        arr.map((nArr) => {
            _arr = _arr.concat(nArr)
        })
        return _arr
    }
}

export default Helper
