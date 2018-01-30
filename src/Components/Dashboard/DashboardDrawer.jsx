import React from 'react'
import {
    MuiThemeProvider,
    Drawer,
    FlatButton,
    List,
    ListItem
} from 'material-ui'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Helper from '../Helper'
import Themes from './../Base/Themes'

const themes = new Themes()
const helper = new Helper()
const styles = require('../Base/styles').styles
const constants = require('../Constants')

const versionNumber = require('../../../package.json').version

function CustomListItem({ label, icon, url }) {
    return (
        <ListItem
            className="menu-item"
            style={styles.menuItem}
            primaryText={label}
            leftIcon={<span className={`fa fa-${icon} menu-icon`} />}
            onClick={() => helper.openUrl(url)}
        />
    )
}

export default function DashboardDrawer({
    isOpen,
    onAddressCopiedListener,
    onChangeContractTypeListener,
    onToggleDrawerListener,
    onExportPrivateKeyDialogListener,
    selectedContractType,
    walletAddress
}) {
    return (
        <MuiThemeProvider muiTheme={themes.getDrawer()}>
            <Drawer
                docked={false}
                width={300}
                open={isOpen}
                onRequestChange={open => onToggleDrawerListener(open)}
            >
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
                                <span className="fa fa-clipboard color-gold ml-2 clickable menu-icon" />
                            </CopyToClipboard>
                        </p>
                    </div>
                </div>
                <List>
                    <ListItem
                        primaryText="Export Private Key"
                        className="menu-item"
                        style={styles.menuItem}
                        leftIcon={<span className={`fa fa-key menu-icon`} />}
                        onClick={onExportPrivateKeyDialogListener}
                    />
                    <CustomListItem
                        label="Buy DBETs"
                        icon="shopping-cart"
                        url="https://www.decent.bet"
                    />
                    <CustomListItem
                        label="DBET News"
                        icon="newspaper-o"
                        url="https://www.decent.bet"
                    />
                    <CustomListItem
                        label="Support"
                        icon="question"
                        url="https://www.decent.bet/support"
                    />
                    <ListItem
                        className="menu-item"
                        primaryText="Token Versions"
                        style={styles.menuItem}
                        leftIcon={
                            <span className={'fa fa-code-fork menu-icon'} />
                        }
                        initiallyOpen={false}
                        primaryTogglesNestedList={true}
                        nestedItems={[
                            <ListItem
                                key={2}
                                className={`menu-item 
                                    ${
                                        constants.TOKEN_TYPE_DBET_TOKEN_NEW ===
                                        selectedContractType
                                            ? 'selected'
                                            : ''
                                    }`}
                                primaryText={
                                    <div className="row">
                                        <div className="col-8">
                                            <p>V2 (CURRENT)</p>
                                        </div>
                                    </div>
                                }
                                onClick={() =>
                                    onChangeContractTypeListener(
                                        constants.TOKEN_TYPE_DBET_TOKEN_NEW
                                    )
                                }
                            />,
                            <ListItem
                                key={1}
                                className={`menu-item 
                                ${
                                    constants.TOKEN_TYPE_DBET_TOKEN_OLD ===
                                    selectedContractType
                                        ? 'selected'
                                        : ''
                                }`}
                                primaryText="V1 (INITIAL)"
                                onClick={() =>
                                    onChangeContractTypeListener(
                                        constants.TOKEN_TYPE_DBET_TOKEN_OLD
                                    )
                                }
                            />
                        ]}
                    />
                    <CustomListItem
                        label="Token Info"
                        icon="info"
                        url="https://www.decent.bet/token/info"
                    />
                    <CustomListItem 
                        label={`Wallet Version: ${versionNumber}`} 
                        icon='microchip'
                        />
                </List>
            </Drawer>
        </MuiThemeProvider>
    )
}
