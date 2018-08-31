import React from 'react'
import { withStyles } from '@material-ui/core'
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
import DashboardDrawerHeader from './DashboardDrawerHeader.jsx'
import AboutDialog from './Dialogs/AboutDialog.jsx'
import Helper from '../Helper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {ExpandLess, ExpandMore} from '@material-ui/icons'

const helper = new Helper()
const constants = require('../Constants')

const versionNumber = require('../../../package.json').version
const styles = theme => ({
    list: {
        maxWidth: 350,
        width: 'auto'
    },
    fullList: {
        
    },
    menuItem: {
        '& $icon': {
            color: theme.palette.primary.light,
            width: '1.5em'
        },
        '&:hover $icon': {
            color: theme.palette.grey[100]
        },
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4,
        '& $icon': {
            color: theme.palette.primary.light
        },
        '&:hover $icon': {
            color: theme.palette.grey[100]
        }
    },
    selected: {
        '& *': {
            color: theme.palette.primary.light
        }
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
function CustomListItem({ label, icon, url, className, iconClass }) {
    return (
        <ListItem
            button
            className={className}
            onClick={onCustomListItemClickListener}
            data-url={url}
        >
            <ListItemIcon  className={iconClass}>
                <FontAwesomeIcon icon={icon} classes="icon"/>
            </ListItemIcon>
            <ListItemText inset primary={label} />
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
    renderTokenVersionListItem = (label, version) => {
        let isSelected = version === this.props.selectedContractType
        return (
            
            <ListItem
                button
                selected={isSelected}
                className={this.props.classes.nested}
                onClick={() => {
                    this.props.onChangeContractTypeListener(version)
                }}
            >
                { isSelected ? 
                    <ListItemText primary={label} 
                                  className={this.props.classes.selected}/> : 
                    <ListItemText primary={label} />}
            </ListItem>
        )
    }

    onCloseableItemClick(fn) {
        this.onDrawerChangeListener()
        fn()
    }
    
    render() {
        let {
            isOpen,
            onAddressCopiedListener,
            onExportPrivateKeyDialogListener,
            walletAddress
        } = this.props
        return (
                <Drawer open={isOpen} onClose={this.onDrawerChangeListener}>
                    <div className={this.props.classes.list} 
                         tabIndex={0}>
                        <DashboardDrawerHeader
                            onToggleDrawerListener={this.onDrawerChangeListener}
                            onAddressCopiedListener={onAddressCopiedListener}
                            walletAddress={walletAddress}
                        />
                        <List component="nav">
                            <ListItem
                                button
                                className={this.props.classes.menuItem}
                                onClick={onExportPrivateKeyDialogListener}
                            >
                                <ListItemIcon className={this.props.classes.icon}>
                                    <FontAwesomeIcon icon="key" />
                                </ListItemIcon>
                                <ListItemText
                                    primary={i18n('ExportPrivateKey')}
                                />
                            </ListItem>
                            <CustomListItem
                                label={i18n('BuyDBETs')}
                                icon="shopping-cart"
                                url="https://decent.bet/how.php"
                                className={this.props.classes.menuItem}
                                iconClass={this.props.classes.icon}
                            />
                            <CustomListItem
                                label={i18n('DBETNews')}
                                icon="newspaper"
                                url="https://decent.bet/announcements.php"
                                className={this.props.classes.menuItem}
                                iconClass={this.props.classes.icon}
                            />
                            <CustomListItem
                                label={i18n('Support')}
                                icon="question"
                                url="https://decent.bet/contact.php"
                                className={this.props.classes.menuItem}
                                iconClass={this.props.classes.icon}
                            />
                            <ListItem
                                button
                                onClick={this.handleToogleTokenVersionDrawerSubmenu}
                                className={this.props.classes.menuItem}
                            >
                                <ListItemIcon className={this.props.classes.icon}>
                                    <FontAwesomeIcon icon="code-branch" />
                                </ListItemIcon>
                                <ListItemText
                                    inset
                                    primary={i18n('TokenVersions')}
                                />
                                {this.state.isDrawerTokenVersionSubmenuOpen ? <ExpandLess className={this.props.classes.icon}/> : <ExpandMore className={this.props.classes.icon}/>}
                            </ListItem>
                            <Collapse
                                in={this.state.isDrawerTokenVersionSubmenuOpen}
                                timeout="auto"
                                unmountOnExit
                            >
                                <List component="nav">
                                    {this.renderTokenVersionListItem(
                                        i18n('V3Vet'),
                                        constants.TOKEN_TYPE_DBET_TOKEN_VET
                                    )}

                                    {this.renderTokenVersionListItem(
                                        i18n('V2Current'),
                                        constants.TOKEN_TYPE_DBET_TOKEN_NEW
                                    )}

                                    {this.renderTokenVersionListItem(
                                        i18n('V1Initial'),
                                        constants.TOKEN_TYPE_DBET_TOKEN_OLD
                                    )}
                                </List>
                            </Collapse>

                            <CustomListItem
                                label={i18n('TokenInfo')}
                                icon="info"
                                url="https://www.decent.bet/token/info"
                                className={this.props.classes.menuItem}
                                iconClass={this.props.classes.icon}
                            />

                            <ListItem
                                button
                                className={this.props.classes.menuItem}
                                onClick={this.onShowAboutDialogListener}
                            >
                                <ListItemIcon className={this.props.classes.icon}>
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
                                <ListItemIcon className={this.props.classes.icon}>
                                    <FontAwesomeIcon icon="sign-out-alt" />
                                </ListItemIcon>
                                <ListItemText inset primary={i18n('LogOut')} />
                            </ListItem>
                        </List>

                        <ListItem
                            button
                            onClick={this.handleToogleLangDrawerSubmenu}
                            className={this.props.classes.menuItem}
                        >
                            <ListItemIcon className={this.props.classes.icon}>
                                <FontAwesomeIcon icon="flag" />
                            </ListItemIcon>
                            <ListItemText
                                inset
                                primary={`Language / ${i18n('Language')}`}
                            />
                            {this.state.isDrawerLangSubmenuOpen ? <ExpandLess className={this.props.classes.icon}/> : <ExpandMore className={this.props.classes.icon}/>}
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
                                    <ListItemIcon className={this.props.classes.icon}>
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
                                    <ListItemIcon className={this.props.classes.icon}>
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
                                    <ListItemIcon className={this.props.classes.icon}>
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
                                    <ListItemIcon className={this.props.classes.icon}>
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
        )
    }
}

DashboardDrawer.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(injectIntl(DashboardDrawer))
