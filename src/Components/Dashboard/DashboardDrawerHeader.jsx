import React from 'react'
import { FlatButton } from 'material-ui'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

const styles = require('../Base/styles').styles

export default function DashboardDrawerHeader({
    onAddressCopiedListener,
    onToggleDrawerListener,
    walletAddress
}) {
    return (
        <div>
            <div className="container drawer">
                <div className="row">
                    <div className="col-12 mt-4 hidden-sm-up">
                        <FlatButton
                            label="X"
                            labelStyle={styles.drawerToggle}
                            className="float-right"
                            onClick={() => onToggleDrawerListener(false)}
                        />
                    </div>
                    <div className="col-12">
                        <img
                            className="logo"
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
