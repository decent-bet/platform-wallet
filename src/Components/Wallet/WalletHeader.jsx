import React from 'react'

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

export default function WalletHeader({ onRefreshListener, address }) {
    return (
        <header className="wallet-header">
            <FlatButton
                className="hidden-md-down"
                label="View account on Etherscan"
                // Opens the url on Etherscan.io
                onClick={openUrlToHash}
                data-address={address}
            />
            <FlatButton
                onClick={onRefreshListener}
                icon={<FontAwesomeIcon icon="sync" />}
                label="Refresh"
            />
        </header>
    )
}
