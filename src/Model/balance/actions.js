import Helper from '../../Components/Helper'
import { createActions } from 'redux-actions'
import Actions, { Prefix } from './actionTypes'
import BigNumber from 'bignumber.js'
import { units } from 'ethereum-units'

const helper = new Helper()

async function fetchTokens() {
    try {
        let address = await fetchPublicAddress()
        let rawResult = await helper
            .getContractHelper()
            .getWrappers()
            .testDecentBetToken()
            .balanceOf(address)
        return new BigNumber(rawResult).dividedBy(units.ether).toNumber()
    } catch (err) {
        console.log('Error retrieving token balance', err.message)
    }
}

async function fetchPublicAddress() {
    return Promise.resolve(helper.getDevWeb3().eth.defaultAccount)
}

async function faucet() {
    try {
        let tx = await helper
            .getContractHelper()
            .getWrappers()
            .testDecentBetToken()
            .faucet()

        console.log('Sent faucet tx', tx)
        helper.toggleSnackbar('Successfully sent faucet transaction')
        return tx
    } catch (err) {
        helper.toggleSnackbar('Error sending faucet transaction')
        console.log('Error sending faucet tx', err.message)
    }
}

// Get Total Ether.
async function fetchEtherBalance() {
    try {
        let address = await fetchPublicAddress()
        let rawAmount = await helper.getDevWeb3().eth.getBalance(address)
        return new BigNumber(rawAmount).dividedBy(units.ether)
    } catch (err) {
        console.log('error retrieving ether balance')
    }
}

// Functions of this object are the "ACTION_KEYS" "inCamelCase"
// They are namespaced by the "Prefix" "inCamelCase".
// Documentation https://redux-actions.js.org/docs/api/createAction.html#createactionsactionmap
export default createActions({
    [Prefix]: {
        [Actions.GET_PUBLIC_ADDRESS]: fetchPublicAddress,
        [Actions.GET_TOKENS]: fetchTokens,
        [Actions.GET_ETHER_BALANCE]: fetchEtherBalance,
        [Actions.FAUCET]: faucet
    }
})
