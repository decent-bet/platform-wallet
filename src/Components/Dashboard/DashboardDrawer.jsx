import React from 'react'
import { MuiThemeProvider, withStyles } from '@material-ui/core'
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Collapse
} from '@material-ui/core'
import { injectIntl } from 'react-intl'
import PropTypes from 'prop-types'
import i18nSettings from '../../i18n'
import { getI18nFn, componentMessages } from '../../i18n/componentMessages'
import { ExpandLess, ExpandMore, StarBorder } from '@material-ui/icons'
import DashboardDrawerHeader from './DashboardDrawerHeader.jsx'
import AboutDialog from './Dialogs/AboutDialog.jsx'
import Helper from '../Helper'
import Themes from './../Base/Themes'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const themes = new Themes()
const helper = new Helper()
const constants = require('../Constants')

const versionNumber = require('../../../package.json').version
const styles = theme => ({
    list: {
        width: 300
    },
    fullList: {
        width: 'auto'
    },
    menuItem: {
        '&:focus, &.selected, &:hover': {
            '& $icon': {
                color: theme.palette.primary.main
            }
        }
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4
    },
    primary: {},
    icon: {}
})

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
function CustomListItem({ label, icon, url, className }) {
    return (
        <ListItem
            button
            className={className}
            onClick={onCustomListItemClickListener}
            data-url={url}
        >
            <ListItemIcon>
                <FontAwesomeIcon icon={icon} style={styles.icon} />
            </ListItemIcon>
            <ListItemText primary={label} />
        </ListItem>
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
            isAboutDialogShown: false,
            isDrawerTokenVersionSubmenuOpen: false,
            isDrawerLangSubmenuOpen: false
        }
        i18n = getI18nFn(this.props.intl, messages)
    }

    handleToogleTokenVersionDrawerSubmenu = () => {
        let isOpen = !this.state.isDrawerTokenVersionSubmenuOpen
        this.setState({ isDrawerTokenVersionSubmenuOpen: isOpen })
    }

    handleToogleLangDrawerSubmenu = () => {
        let isOpen = !this.state.isDrawerLangSubmenuOpen
        this.setState({ isDrawerLangSubmenuOpen: isOpen })
    }
    // Toggles the drawer.
    onDrawerChangeListener = () => this.props.onToggleDrawerListener(false)

    // Shows the About Dialog
    onShowAboutDialogListener = () =>
        this.setState({ isAboutDialogShown: true })

    // Closes the About Dialog
    onCloseAboutDialogListener = () =>
        this.setState({ isAboutDialogShown: false })

    // Builds the items for the version switcher
    renderTokenVersionListItem = (label, version, className) => {
        let isSelected = version === this.props.selectedContractType
        return (
            <ListItem
                selected={isSelected}
                key={version}
                className={className}
                onClick={() => {
                    this.props.onChangeContractTypeListener(version)
                }}
                data-contract-version={version}
            >
                <ListItemText
                    primary={
                        <div className="row">
                            <div className="col-8">
                                <p>{label}</p>
                            </div>
                        </div>
                    }
                />
            </ListItem>
        )
    }

    render() {
        let {
            isOpen,
            onAddressCopiedListener,
            onExportPrivateKeyDialogListener,
            walletAddress
        } = this.props
        return (
            <MuiThemeProvider theme={themes.getDrawer()}>
                <Drawer open={isOpen} onClose={this.onDrawerChangeListener}>
                    <div className={this.props.classes.list} tabIndex={0}>
                        <DashboardDrawerHeader
                            onToggleDrawerListener={this.onDrawerChangeListener}
                            onAddressCopiedListener={onAddressCopiedListener}
                            walletAddress={walletAddress}
                        />
                        <List>
                            <ListItem
                                button
                                className={this.props.classes.menuItem}
                                onClick={onExportPrivateKeyDialogListener}
                            >
                                <ListItemIcon>
                                    <FontAwesomeIcon icon="key" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={i18n('ExportPrivateKey')}
                                />
                            </ListItem>
                            <CustomListItem
                                label={i18n('BuyDBETs')}
                                icon="shopping-cart"
                                url="https://www.decent.bet/buy"
                                className={this.props.classes.menuItem}
                            />
                            <CustomListItem
                                label={i18n('DBETNews')}
                                icon="newspaper"
                                url="https://www.decent.bet/news"
                                className={this.props.classes.menuItem}
                            />
                            <CustomListItem
                                label={i18n('Support')}
                                icon="question"
                                url="https://www.decent.bet/support"
                                className={this.props.classes.menuItem}
                            />
                            <ListItem
                                button
                                onClick={this.handleToogleTokenVersionDrawerSubmenu}
                                className={this.props.classes.menuItem}
                            >
                                <ListItemIcon>
                                    <FontAwesomeIcon icon="code-branch" />
                                </ListItemIcon>
                                <ListItemText
                                    inset
                                    primary={i18n('TokenVersions')}
                                />
                                {this.state.isDrawerTokenVersionSubmenuOpen ? (
                                    <ExpandLess />
                                ) : (
                                    <ExpandMore />
                                )}
                            </ListItem>
                            <Collapse
                                in={this.state.isDrawerTokenVersionSubmenuOpen}
                                timeout="auto"
                                unmountOnExit
                            >
                                <List component="div" disablePadding>
                                    {this.renderTokenVersionListItem(
                                        i18n('V3Vet'),
                                        constants.TOKEN_TYPE_DBET_TOKEN_VET,
                                        this.props.classes.nested
                                    )}

                                    {this.renderTokenVersionListItem(
                                        i18n('V2Current'),
                                        constants.TOKEN_TYPE_DBET_TOKEN_NEW,
                                        this.props.classes.nested
                                    )}

                                    {this.renderTokenVersionListItem(
                                        i18n('V1Initial'),
                                        constants.TOKEN_TYPE_DBET_TOKEN_OLD,
                                        this.props.classes.nested
                                    )}
                                </List>
                            </Collapse>

                            <CustomListItem
                                label={i18n('TokenInfo')}
                                icon="info"
                                url="https://www.decent.bet/token/info"
                                className={this.props.classes.menuItem}
                            />

                            <ListItem
                                button
                                className={this.props.classes.menuItem}
                                onClick={this.onShowAboutDialogListener}
                            >
                                <ListItemIcon>
                                    <FontAwesomeIcon icon="microchip" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={`${i18n(
                                        'WalletVersion'
                                    )}: ${versionNumber}`}
                                />
                            </ListItem>
                            <Divider />

                            <ListItem
                                button
                                className={this.props.classes.menuItem}
                                onClick={this.props.onLogoutListener}
                            >
                                <ListItemIcon>
                                    <FontAwesomeIcon icon="sign-out-alt" />
                                </ListItemIcon>
                                <ListItemText primary={i18n('LogOut')} />
                            </ListItem>
                        </List>

                        <ListItem
                            button
                            onClick={this.handleToogleDrawerSubmenu}
                            className={this.props.classes.menuItem}
                        >
                            <ListItemIcon>
                                <FontAwesomeIcon icon="flag" />
                            </ListItemIcon>
                            <ListItemText
                                inset
                                primary={`Language / ${i18n('Language')}`}
                            />
                            {this.state.isDrawerLangSubmenuOpen ? (
                                <ExpandLess />
                            ) : (
                                <ExpandMore />
                            )}
                        </ListItem>
                        <Collapse
                            in={this.state.isDrawerLangSubmenuOpen}
                            timeout="auto"
                            unmountOnExit
                        >
                            <List component="div" disablePadding>
                                <ListItem
                                    button
                                    className={this.props.classes.nested}
                                    onClick={() =>
                                        i18nSettings.setLanguage('en')
                                    }
                                >
                                    <ListItemIcon>
                                        <FontAwesomeIcon icon="language" />
                                    </ListItemIcon>
                                    <ListItemText primary="English" />
                                </ListItem>
                                <ListItem
                                    button
                                    className={this.props.classes.nested}
                                    onClick={() =>
                                        i18nSettings.setLanguage('ja')
                                    }
                                >
                                    <ListItemIcon>
                                        <FontAwesomeIcon icon="language" />
                                    </ListItemIcon>
                                    <ListItemText primary="Japanese" />
                                </ListItem>
                                <ListItem
                                    button
                                    className={this.props.classes.nested}
                                    onClick={() =>
                                        i18nSettings.setLanguage('ko')
                                    }
                                >
                                    <ListItemIcon>
                                        <FontAwesomeIcon icon="language" />
                                    </ListItemIcon>
                                    <ListItemText primary="Korean" />
                                </ListItem>
                                <ListItem
                                    button
                                    className={this.props.classes.nested}
                                    onClick={() =>
                                        i18nSettings.setLanguage('zh')
                                    }
                                >
                                    <ListItemIcon>
                                        <FontAwesomeIcon icon="language" />
                                    </ListItemIcon>
                                    <ListItemText primary="Chinese" />
                                </ListItem>
                            </List>
                        </Collapse>
                        <AboutDialog
                            isShown={this.state.isAboutDialogShown}
                            onCloseListener={this.onCloseAboutDialogListener}
                        />
                    </div>
                </Drawer>
            </MuiThemeProvider>
        )
    }
}

DashboardDrawer.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(injectIntl(DashboardDrawer))
