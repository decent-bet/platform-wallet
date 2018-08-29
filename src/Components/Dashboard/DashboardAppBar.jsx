import React from 'react'
import { AppBar, IconButton, Toolbar } from '@material-ui/core'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
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
    button: {
        margin: theme.spacing.unit
    },
    extendedIcon: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit
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
                    className={classes.button}
                    color="inherit"
                    aria-label="Menu"
                    onClick={onMenuToggle}
                >
                    <FontAwesomeIcon icon="bars" />
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


DashboardAppBar.propTypes = {
    classes: PropTypes.object.isRequired
}
export default withStyles(styles)(DashboardAppBar)
