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
    if (selectedTokenContract === constants.TOKEN_TYPE_DBET_TOKEN_VET) {
        return (
            <header className="wallet-header">
                <Button
                    className="hidden-md-down"
                    onClick={openUrlToVeforge}
                    data-address={address}
                >
                    View account on Veforge
                </Button>
                <Button
                    onClick={onRefreshListener}
                    icon={<FontAwesomeIcon icon="sync" />}
                >
                    {i18n('Refresh')}
                </Button>
            </header>
        )
    }
    // icon={<FontAwesomeIcon icon="sync" />}
    return (
        <header className="wallet-header">
            <Button
                className="hidden-md-down"
                // Opens the url on Etherscan.io
                onClick={openUrlToHash}
                data-address={address}
            >
                {i18n('ViewAccountOnEtherscan')}
            </Button>
            <Button onClick={onRefreshListener}>{i18n('Refresh')}</Button>
        </header>
    )
}

export default injectIntl(WalletHeader)
