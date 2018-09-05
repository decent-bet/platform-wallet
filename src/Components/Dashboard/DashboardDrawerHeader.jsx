import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

const styles = () => ({
    drawerLogoWrapper: {
        margin: '2em',
        marginBottom: '2em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    drawerLogo: {
        maxHeight: '32px',
        objectFit: 'contain'
    },
    drawerToggle: {
        fontSize: '1rem',
        fontFamily: 'Roboto',
        float: 'right'
    }
})

function DashboardDrawerHeader({
    classes,
    onAddressCopiedListener,
    onToggleDrawerListener,
    walletAddress
}) {
    return (
        <div>
            <div className="container drawer">
                <div className="row">
                    <div className={classes.drawerLogoWrapper}>
                        <img
                            className={classes.drawerLogo}
                            src={
                                process.env.PUBLIC_URL +
                                '/assets/img/logos/dbet-white.png'
                            }
                            alt="Decent.bet Logo"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

DashboardDrawerHeader.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
export default withStyles(styles)(DashboardDrawerHeader);

