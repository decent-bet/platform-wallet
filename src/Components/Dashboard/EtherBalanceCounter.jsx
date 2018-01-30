import React from 'react'
import { FlatButton } from 'material-ui'

const constants = require('../Constants')
const styles = require('../Base/styles').styles

export default function EtherBalanceCounter({ isLoading, balance }) {
    return (
        <FlatButton
            className="hidden-md-down mx-auto address-label"
            label={
                <span className="value-label">
                    Ethereum Balance
                    <span className="value">
                        {isLoading
                            ? constants.TOKEN_BALANCE_LOADING
                            : balance}
                    </span>
                </span>
            }
            labelStyle={styles.addressLabel}
        />
    )
}
