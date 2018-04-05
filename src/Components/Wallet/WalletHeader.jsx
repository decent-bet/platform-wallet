import React from 'react'
import { injectIntl } from 'react-intl'
import { componentMessages, getI18nFn } from '../../i18n/componentMessages'

const messages = componentMessages('src.Components.Wallet.WalletHeader', [
    'ViewAccountOnEtherscan',
    'Refresh'
])
import { FlatButton } from 'material-ui'

import Helper from '../Helper'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

const helper = new Helper()

// Reads the address from the 'data-address' attribute. Opens the account in Etherscan
function openUrlToHash(event) {
    let address = event.currentTarget.dataset.address
    if (address) {
        helper.openUrl(`https://etherscan.io/address/${address}`)
    }
}

function WalletHeader({ intl, onRefreshListener, address }) {
    const i18n = getI18nFn(intl, messages)
    return (
        <header className="wallet-header">
            <FlatButton
                className="hidden-md-down"
                label={i18n('ViewAccountOnEtherscan')}
                // Opens the url on Etherscan.io
                onClick={openUrlToHash}
                data-address={address}
            />
            <FlatButton
                onClick={onRefreshListener}
                icon={<FontAwesomeIcon icon="sync" />}
                label={i18n('Refresh')}
            />
        </header>
    )
}

export default injectIntl(WalletHeader)
