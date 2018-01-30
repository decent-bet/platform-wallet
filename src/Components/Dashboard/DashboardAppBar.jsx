import React from 'react'
import { AppBar, FlatButton } from 'material-ui'

import EtherBalanceCounter from './EtherBalanceCounter.jsx'
import AddressCounter from './AddressCounter.jsx'

const styles = require('../Base/styles').styles

export default function DashboardAppBar({
    address,
    balance,
    isLoading,
    onMenuToggle,
    onAddressCopyListener,
    onLogout
}) {
    return (
        <AppBar
            zDepth={4}
            style={styles.appbar}
            className="appbar"
            showMenuIconButton={true}
            onLeftIconButtonTouchTap={onMenuToggle}
            iconElementRight={
                <div className="row mt-1">
                    <EtherBalanceCounter
                        balance={balance}
                        isLoading={isLoading}
                    />
                    <AddressCounter
                        address={address}
                        listener={onAddressCopyListener}
                    />
                    <FlatButton
                        label="Log out"
                        className="mr-3"
                        onClick={onLogout}
                        labelStyle={{
                            fontFamily: 'Lato'
                        }}
                    />
                </div>
            }
        />
    )
}
