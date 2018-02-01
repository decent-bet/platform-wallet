import React from 'react'
import { FlatButton } from 'material-ui'
import Helper from '../Helper'

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
                        <i className="fa fa-bar-chart" /> View account on Etherscan.io
                    </span>
                }
            />
            <FlatButton
                className="float-right"
                onClick={onRefreshListener}
                label={
                    <span className="button-label">
                        <i className="fa fa-refresh" /> Refresh
                    </span>
                }
            />
        </header>
    )
}
