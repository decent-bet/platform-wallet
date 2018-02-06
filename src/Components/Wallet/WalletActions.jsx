import React from 'react'
import { FlatButton, RaisedButton, CardActions } from 'material-ui'
import Helper from '../Helper'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

const helper = new Helper()

// Reads the address from the 'data-address' attribute. Opens the account in Etherscan
function openUrlToHash(event){
    let address = event.currentTarget.dataset.address
    if (address){
        helper.openUrl(`https://etherscan.io/address/${address}`)
    }
}

export default function WalletActions({ onRefreshListener, address, onSendListener }) {
    return (
        <CardActions className='wallet-actions'>
            <FlatButton
                className="hidden-md-down"
                icon={<FontAwesomeIcon icon="chart-bar" />}
                label="View account on Etherscan.io"

                // Opens the url on Etherscan.io
                onClick={openUrlToHash}
                data-address={address}
            />
            <FlatButton
                onClick={onRefreshListener}
                icon={<FontAwesomeIcon icon="sync" />}
                label="Refresh"
            />

            <RaisedButton
                primary={true}
                onClick={onSendListener}
                icon={<FontAwesomeIcon icon="paper-plane" />}
                label="Send DBETs"
                />
        </CardActions>
    )
}
