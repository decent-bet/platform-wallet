import React from 'react'
import { AppBar } from 'material-ui'

import EtherBalanceCounter from './BalanceCounter.jsx'
import AddressCounter from './AddressCounter.jsx'

const styles = require('../Base/styles').styles

export default function DashboardAppBar({
    address,
    balance,
    currency,
    isLoading,
    onMenuToggle,
    onAddressCopyListener
}) {
    return (
        <AppBar
            zDepth={4}
            style={styles.appbar}
            className="appbar"
            showMenuIconButton={true}
            onLeftIconButtonClick={onMenuToggle}
            iconElementRight={
                <div className="row mt-1">
                    <EtherBalanceCounter
                        currency={currency}
                        balance={balance}
                        isLoading={isLoading}
                    />
                    <AddressCounter
                        address={address}
                        listener={onAddressCopyListener}
                    />
                </div>
            }
        />
    )
}
