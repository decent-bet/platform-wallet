import React from 'react'
import { FlatButton } from 'material-ui'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const styles = require('../Base/styles').styles

export default function AddressCounter({ address, listener }) {
    return (
        <FlatButton
            className="hidden-md-down"
            label={
                <CopyToClipboard text={address} onCopy={listener}>
                    <span className="value-label">
                        Public Address
                        <span className="value">{address}</span>
                    </span>
                </CopyToClipboard>
            }
            labelStyle={styles.addressLabel}
        />
    )
}
