import React from 'react'
import { injectIntl } from 'react-intl'
import { componentMessages, getI18nFn } from '../../i18n/componentMessages'
import { Button } from '@material-ui/core'

import Helper from '../Helper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
const messages = componentMessages('src.Components.Wallet.WalletHeader', [
    'ViewAccountOnEtherscan',
    'Refresh'
])

const helper = new Helper()
const constants = require('../Constants')
// Reads the address from the 'data-address' attribute. Opens the account in Etherscan
function openUrlToHash(event) {
    let address = event.currentTarget.dataset.address
    if (address) {
        helper.openUrl(`https://etherscan.io/address/${address}`)
    }
}
function openUrlToVeforge(event) {
    let address = event.currentTarget.dataset.address
    if (address) {
        helper.openUrl(`https://testnet.veforge.com/accounts/${address}`)
    }
}
function WalletHeader({
    selectedTokenContract,
    intl,
    onRefreshListener,
    address
}) {
    const i18n = getI18nFn(intl, messages)
    const onClick = selectedTokenContract === constants.TOKEN_TYPE_DBET_TOKEN_VET ? openUrlToVeforge: openUrlToHash
    const addressMessage = selectedTokenContract === constants.TOKEN_TYPE_DBET_TOKEN_VET ? 'View account on Veforge' : i18n('ViewAccountOnEtherscan')

    return (
        <header className="wallet-header">
            <Button
                className="hidden-md-down"
                onClick={onClick}
                data-address={address}
            >
                {addressMessage}
            </Button>
            <Button onClick={onRefreshListener}>
                <FontAwesomeIcon icon="sync" style={{marginRight: '0.6em'}}/> 
                {i18n('Refresh')}
            </Button>
        </header>
    )
}

export default injectIntl(WalletHeader)
