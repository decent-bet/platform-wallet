import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const styles = () => ({
    drawerLogo: {
        marginTop: '2em',
        marginBottom: '2em',
        maxHeight: '32px'
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
                    <div className="col-12 mt-4 hidden-sm-up">
                        <Button
                            className={classes.drawerToggle}
                            onClick={() => onToggleDrawerListener(false)}
                        >
                        X
                        </Button>
                    </div>
                    <div className="col-12">
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
            <div className="row">
                <div className="col-12 hidden-sm-up">
                    <p className="address-mobile">
                        {walletAddress}
                        <CopyToClipboard
                            text={walletAddress}
                            onCopy={onAddressCopiedListener}
                        >
                            <FontAwesomeIcon
                                icon="clipboard"
                                className="color-gold ml-2 clickable menu-icon"
                            />
                        </CopyToClipboard>
                    </p>
                </div>
            </div>
        </div>
    )
}

DashboardDrawerHeader.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
export default withStyles(styles)(DashboardDrawerHeader);

