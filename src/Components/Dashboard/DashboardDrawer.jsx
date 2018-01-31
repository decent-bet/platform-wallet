import React from 'react'
import { MuiThemeProvider, Drawer, List, ListItem } from 'material-ui'

import DashboardDrawerHeader from './DashboardDrawerHeader.jsx'
import Helper from '../Helper'
import Themes from './../Base/Themes'

const themes = new Themes()
const helper = new Helper()
const styles = require('../Base/styles').styles
const constants = require('../Constants')

const versionNumber = require('../../../package.json').version

// Simple list item for an URL link
function CustomListItem({ label, icon, url }) {
    return (
        <ListItem
            className="menu-item"
            style={styles.menuItem}
            primaryText={label}
            leftIcon={<span className={`fa fa-${icon} menu-icon`} />}
            onClick={onCustomListItemClickListener}
            data-url={url}
        />
    )
}

// Listener for the Custom List Item. Requires the 'data-url' attribute in element
function onCustomListItemClickListener(event) {
    let url = event.currentTarget.dataset.url
    if (url) {
        helper.openUrl(url)
    }
}

// Dashboard Drawer
export default class DashboardDrawer extends React.Component {
    // Toggles the drawer.
    onDrawerChangeListener = open => this.props.onToggleDrawerListener(open)

    // Builds the items for the version switcher
    renderTokenVersionListItem = (label, version) => {
        let isSelected = version === this.props.selectedContractType
        let className = `menu-item ${isSelected ? 'selected' : ''}`
        return (
            <ListItem
                key={version}
                className={className}
                onClick={() => {
                    this.props.onChangeContractTypeListener(version)
                }}
                data-contract-version={version}
                primaryText={
                    <div className="row">
                        <div className="col-8">
                            <p>{label}</p>
                        </div>
                    </div>
                }
            />
        )
    }

    render() {
        let {
            isOpen,
            onAddressCopiedListener,
            onLogoutListener,
            onToggleDrawerListener,
            onExportPrivateKeyDialogListener,
            walletAddress
        } = this.props
        return (
            <MuiThemeProvider muiTheme={themes.getDrawer()}>
                <Drawer
                    docked={false}
                    width={300}
                    open={isOpen}
                    onRequestChange={this.onDrawerChangeListener}
                >
                    <DashboardDrawerHeader
                        onToggleDrawerListener={onToggleDrawerListener}
                        onAddressCopiedListener={onAddressCopiedListener}
                        walletAddress={walletAddress}
                    />
                    <List>
                        <ListItem
                            primaryText="Export Private Key"
                            className="menu-item"
                            style={styles.menuItem}
                            leftIcon={
                                <span className={`fa fa-key menu-icon`} />
                            }
                            onClick={onExportPrivateKeyDialogListener}
                        />
                        <CustomListItem
                            label="Buy DBETs"
                            icon="shopping-cart"
                            url="https://www.decent.bet/buy"
                        />
                        <CustomListItem
                            label="DBET News"
                            icon="newspaper-o"
                            url="https://www.decent.bet/news"
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
                                this.renderTokenVersionListItem(
                                    'V2 (CURRENT)',
                                    constants.TOKEN_TYPE_DBET_TOKEN_NEW
                                ),
                                this.renderTokenVersionListItem(
                                    'V1 (INITIAL)',
                                    constants.TOKEN_TYPE_DBET_TOKEN_OLD
                                )
                            ]}
                        />
                        <CustomListItem
                            label="Token Info"
                            icon="info"
                            url="https://www.decent.bet/token/info"
                        />
                        <ListItem
                            primaryText="Log Out"
                            className="menu-item"
                            style={styles.menuItem}
                            leftIcon={
                                <span className={`fa fa-sign-out menu-icon`} />
                            }
                            onClick={onLogoutListener}
                        />
                        <CustomListItem
                            label={`Wallet Version: ${versionNumber}`}
                            icon="microchip"
                        />
                    </List>
                </Drawer>
            </MuiThemeProvider>
        )
    }
}
