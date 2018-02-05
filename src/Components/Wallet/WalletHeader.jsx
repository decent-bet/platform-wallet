import React from 'react'
import { FlatButton } from 'material-ui'
import Helper from '../Helper'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

const helper = new Helper()

export default function WalletHeader({ onRefreshListener, address }) {
    return (
        <header className="col-12 px-0">
            <FlatButton
                className="hidden-md-down mx-auto address-label"
                onClick={() =>
                    helper.openUrl(`https://etherscan.io/address/${address}`)
                }
                label={
                    <span className="button-label">
                        <FontAwesomeIcon icon="chart-bar" /> View account on Etherscan.io
                    </span>
                }
            />
            <FlatButton
                className="float-right"
                onClick={onRefreshListener}
                label={
                    <span className="button-label">
                        <FontAwesomeIcon icon="sync" /> Refresh
                    </span>
                }
            />
        </header>
    )
}
