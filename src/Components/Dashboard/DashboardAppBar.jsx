import React from 'react'
import { AppBar } from 'material-ui'

import EtherBalanceCounter from './BalanceCounter.jsx'
import AddressCounter from './AddressCounter.jsx'
const constants = require('../Constants')
const styles = require('../Base/styles').styles

const BalanceSelector = ({ contractType, currency, balance, isLoading }) => {
    if (contractType === constants.TOKEN_TYPE_DBET_TOKEN_VET) {
        return (        <EtherBalanceCounter
            currency='VET'
            balance={balance}
            isLoading={isLoading}
        />)
    }
    return (
        <EtherBalanceCounter
        currency='ETH'
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

    return (
        <AppBar
            zDepth={4}
            style={styles.appbar}
            className="appbar"
            showMenuIconButton={true}
            onLeftIconButtonClick={onMenuToggle}
            iconElementRight={
                <div className="row mt-1">
                    <BalanceSelector contractType={selectedTokenContract}
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
