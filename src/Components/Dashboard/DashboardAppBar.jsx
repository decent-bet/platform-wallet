import React from 'react'
import { AppBar, IconButton, Toolbar } from '@material-ui/core'

import EtherBalanceCounter from './BalanceCounter.jsx'
import AddressCounter from './AddressCounter.jsx'
const constants = require('../Constants')
const styles = require('../Base/styles').styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
const BalanceSelector = ({ contractType, currency, balance, isLoading }) => {
    if (contractType === constants.TOKEN_TYPE_DBET_TOKEN_VET) {
        return (
            <EtherBalanceCounter
                currency="VET"
                balance={balance}
                isLoading={isLoading}
            />
        )
    }
    return (
        <EtherBalanceCounter
            currency="ETH"
            balance={balance}
            isLoading={isLoading}
        />
    )
}
export default function DashboardAppBar({
    selectedTokenContract,
    address,
    balance,
    currency,
    isLoading,
    onMenuToggle,
    onAddressCopyListener
}) {
    //     <AppBar
    //     zDepth={4}
    //     style={styles.appbar}
    //     className="appbar"
    //     showMenuIconButton={true}
    //     onLeftIconButtonClick={onMenuToggle}
    //     iconElementRight={
    //         <div className="row mt-1">
    //             <BalanceSelector contractType={selectedTokenContract}
    //                 currency={currency}
    //                 balance={balance}
    //                 isLoading={isLoading}
    //             />
    // <AddressCounter
    //     address={address}
    //     listener={onAddressCopyListener}
    // />
    //         </div>
    //     }
    // />
    return (
        <AppBar className="appbar" position="fixed" color="primary">
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="Menu"
                    onClick={onMenuToggle}
                >
                    {/* <FontAwesomeIcon icon="bars" /> */}
                </IconButton>
                <BalanceSelector
                    contractType={selectedTokenContract}
                    currency={currency}
                    balance={balance}
                    isLoading={isLoading}
                />
                <AddressCounter
                    address={address}
                    listener={onAddressCopyListener}
                />
            </Toolbar>
        </AppBar>
    )
}
