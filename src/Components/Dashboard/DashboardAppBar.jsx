import React from 'react'
import { AppBar, IconButton, Toolbar } from '@material-ui/core'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'
import EtherBalanceCounter from './BalanceCounter.jsx'
import AddressCounter from './AddressCounter.jsx'
const constants = require('../Constants')

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
    balance,
    currency,
    isLoading,
    onMenuToggle,
    onAddressCopyListener
}) {
    return (
        <div className={classes.root}>
        <AppBar position="static" color="primary">
            <Toolbar>
                <IconButton className={classes.menuButton} 
                            color="inherit" 
                            aria-label="Menu"
                            onClick={onMenuToggle}>
                    <MenuIcon />
                </IconButton>
                
                <div className={classes.rightMenu}>
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
                </div>
            </Toolbar>
        </AppBar>
        </div>
    )
}


DashboardAppBar.propTypes = {
    classes: PropTypes.object.isRequired
}
export default withStyles(styles)(DashboardAppBar)
