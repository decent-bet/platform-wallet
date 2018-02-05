import React from 'react'
import { AppBar, MuiThemeProvider } from 'material-ui'

import EtherBalanceCounter from './EtherBalanceCounter.jsx'
import AddressCounter from './AddressCounter.jsx'
import Themes from './../Base/Themes'

const styles = require('../Base/styles').styles
const themes = new Themes()

export default function DashboardAppBar({
    address,
    balance,
    isLoading,
    onMenuToggle,
    onAddressCopyListener
}) {
    return (
        <MuiThemeProvider muiTheme={themes.getAppBar()}>
            <AppBar
                zDepth={4}
                style={styles.appbar}
                className="appbar"
                showMenuIconButton={true}
                onLeftIconButtonClick={onMenuToggle}
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
                    </div>
                }
            />
        </MuiThemeProvider>
    )
}
