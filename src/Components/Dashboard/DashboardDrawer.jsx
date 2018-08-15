import React from 'react'
import { MuiThemeProvider, Drawer, List, ListItem, Divider } from 'material-ui'
import { injectIntl } from 'react-intl'

import i18nSettings from '../../i18n'
import { getI18nFn, componentMessages } from '../../i18n/componentMessages'

import DashboardDrawerHeader from './DashboardDrawerHeader.jsx'
import AboutDialog from './Dialogs/AboutDialog.jsx'
import Helper from '../Helper'
import Themes from './../Base/Themes'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

const themes = new Themes()
const helper = new Helper()
const styles = require('../Base/styles').styles
const constants = require('../Constants')

const versionNumber = require('../../../package.json').version

const messages = componentMessages('src.Components.Dashboard.DashboardDrawer', [
    'ExportPrivateKey',
    'BuyDBETs',
    'DBETNews',
    'Support',
    'TokenVersions',
    'V1Initial',
    'V2Current',
    'V3Vet',
    'TokenInfo',
    'WalletVersion',
    'LogOut',
    'Language'
])
let i18n

// Simple list item for an URL link
function CustomListItem({ label, icon, url }) {
    return (
        <ListItem
            className="menu-item"
            style={styles.menuItem}
            primaryText={label}
            leftIcon={<FontAwesomeIcon icon={icon} />}
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
class DashboardDrawer extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            isAboutDialogShown: false
        }
        i18n = getI18nFn(this.props.intl, messages)
    }

    // Toggles the drawer.
    onDrawerChangeListener = open => this.props.onToggleDrawerListener(open)

    // Shows the About Dialog
    onShowAboutDialogListener = () =>
        this.setState({ isAboutDialogShown: true })

    // Closes the About Dialog
    onCloseAboutDialogListener = () =>
        this.setState({ isAboutDialogShown: false })

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
                            primaryText={i18n('ExportPrivateKey')}
                            className="menu-item"
                            style={styles.menuItem}
                            leftIcon={<FontAwesomeIcon icon="key" />}
                            onClick={onExportPrivateKeyDialogListener}
                        />
                        <CustomListItem
                            label={i18n('BuyDBETs')}
                            icon="shopping-cart"
                            url="https://www.decent.bet/buy"
                        />
                        <CustomListItem
                            label={i18n('DBETNews')}
                            icon="newspaper"
                            url="https://www.decent.bet/news"
                        />
                        <CustomListItem
                            label={i18n('Support')}
                            icon="question"
                            url="https://www.decent.bet/support"
                        />
                        <ListItem
                            className="menu-item"
                            primaryText={i18n('TokenVersions')}
                            style={styles.menuItem}
                            leftIcon={<FontAwesomeIcon icon="code-branch" />}
                            initiallyOpen={false}
                            primaryTogglesNestedList={true}
                            nestedItems={[
                                this.renderTokenVersionListItem(
                                    i18n('V3Vet'),
                                    constants.TOKEN_TYPE_DBET_TOKEN_VET
                                ),
                                this.renderTokenVersionListItem(
                                    i18n('V2Current'),
                                    constants.TOKEN_TYPE_DBET_TOKEN_NEW
                                ),
                                this.renderTokenVersionListItem(
                                    i18n('V1Initial'),
                                    constants.TOKEN_TYPE_DBET_TOKEN_OLD
                                )
                            ]}
                        />
                        <CustomListItem
                            label={i18n('TokenInfo')}
                            icon="info"
                            url="https://www.decent.bet/token/info"
                        />

                        <ListItem
                            primaryText={`${i18n(
                                'WalletVersion'
                            )}: ${versionNumber}`}
                            className="menu-item"
                            style={styles.menuItem}
                            leftIcon={<FontAwesomeIcon icon="microchip" />}
                            onClick={this.onShowAboutDialogListener}
                        />

                        <Divider />

                        <ListItem
                            primaryText={i18n('LogOut')}
                            className="menu-item"
                            style={styles.menuItem}
                            leftIcon={<FontAwesomeIcon icon="sign-out-alt" />}
                            onClick={onLogoutListener}
                        />
                    </List>

                    <ListItem
                        className="menu-item"
                        primaryText={`Language / ${i18n('Language')}` }
                        style={styles.menuItem}
                        leftIcon={<FontAwesomeIcon icon="flag"/>}
                        initiallyOpen={false}
                        primaryTogglesNestedList={true}
                        nestedItems={[<ListItem key="en"
                            primaryText='English'
                            className="menu-item"
                            style={styles.menuItem}
                            leftIcon={<FontAwesomeIcon icon="language"/>}
                            onClick={()=> i18nSettings.setLanguage('en')}
                        />,
                            <ListItem
                                primaryText='Japanese' key="ja"
                                className="menu-item"
                                style={styles.menuItem}
                                leftIcon={<FontAwesomeIcon icon="language"/>}
                                onClick={() => i18nSettings.setLanguage('ja')}
                            />,
                            <ListItem
                                primaryText='Korean'
                                className="menu-item" key="ko"
                                style={styles.menuItem}
                                leftIcon={<FontAwesomeIcon icon="language"/>}
                                onClick={() => i18nSettings.setLanguage('ko')}
                            />, <ListItem
                                primaryText='Chinese'
                                className="menu-item" key="zh"
                                style={styles.menuItem}
                                leftIcon={<FontAwesomeIcon icon="language"/>}
                                onClick={() => i18nSettings.setLanguage('zh')}
                            />]
                        }
                    />
                    <AboutDialog
                        isShown={this.state.isAboutDialogShown}
                        onCloseListener={this.onCloseAboutDialogListener}
                    />
                </Drawer>
            </MuiThemeProvider>
        )
    }
}

export default injectIntl(DashboardDrawer)
