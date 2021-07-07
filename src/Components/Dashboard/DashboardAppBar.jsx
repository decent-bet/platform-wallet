import React from 'react'
import { AppBar, IconButton, Toolbar } from '@material-ui/core'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'
import EtherBalanceCounter from './BalanceCounter.jsx'
import AddressCounter from './AddressCounter.jsx'
import TokenVersion from './TokenVersion.jsx'
const constants = require('../Constants')

const BalanceSelector = ({
    contractType,
    currency,
    vthoBalance,
    isLoading
}) => {
    return (
        <EtherBalanceCounter
            currency="VTHO"
            balance={vthoBalance}
            isLoading={isLoading}
        />
    )
}

const TokenVersionSelector = ({ contractType, isLoading }) => {
    if (contractType === constants.TOKEN_TYPE_DBET_TOKEN_VET) {
        return <TokenVersion selectedToken="V3" isLoading={isLoading} />
    } else if (contractType === constants.TOKEN_TYPE_DBET_TOKEN_NEW) {
        return <TokenVersion selectedToken="V2" isLoading={isLoading} />
    }
    return <TokenVersion selectedToken="V1" isLoading={isLoading} />
}

const styles = theme => ({
    rightMenu: {
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%'
    },
    menuButton: {
        color: theme.palette.common.white
    }
})

function DashboardAppBar({
    classes,
    selectedTokenContract,
    address,
    ethBalance,
    vthoBalance,
    currency,
    isLoading,
    onMenuToggle,
    onAddressCopyListener
}) {
    return (
        <AppBar position="fixed" color="primary">
            <Toolbar>
                <IconButton
                    className={classes.menuButton}
                    color="inherit"
                    aria-label="Menu"
                    onClick={onMenuToggle}
                >
                    <MenuIcon />
                </IconButton>

                <div className={classes.rightMenu}>
                    <BalanceSelector
                        contractType={selectedTokenContract}
                        currency={currency}
                        vthoBalance={vthoBalance}
                        isLoading={isLoading}
                    />
                    <AddressCounter
                        address={address}
                        listener={onAddressCopyListener}
                    />
                </div>
            </Toolbar>
        </AppBar>
    )
}

DashboardAppBar.propTypes = {
    classes: PropTypes.object.isRequired
}
export default withStyles(styles)(DashboardAppBar)
