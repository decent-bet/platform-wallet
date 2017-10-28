import React, {Component} from 'react'

import {AppBar, Drawer, FlatButton, List, ListItem, MuiThemeProvider, Snackbar} from 'material-ui'
import {CopyToClipboard} from 'react-copy-to-clipboard'

import ConfirmationDialog from '../Base/Dialogs/ConfirmationDialog'
import PasswordEntryDialog from '../Base/Dialogs/PasswordEntryDialog'
import Send from '../Wallet/Send'
import Wallet from '../Wallet/Wallet'

import Helper from '../Helper'
import KeyHandler from '../Base/KeyHandler'
import Themes from './../Base/Themes'

import './dashboard.css'

const keyHandler = new KeyHandler()
const themes = new Themes()
const helper = new Helper()

const constants = require('../Constants')
const styles = require('../Base/styles').styles

const versionNumber = require('../../../package.json').version

const VIEW_WALLET = 0
const VIEW_SEND = 1

const DIALOG_PASSWORD_ENTRY = 0, DIALOG_PRIVATE_KEY = 1

class Dashboard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            view: props.view,
            address: helper.getWeb3().eth.defaultAccount,
            ethNetwork: 0,
            balance: 0,
            selectedTokenContract: helper.getSelectedTokenContract(),
            drawer: {
                open: false
            },
            snackbar: {
                open: false
            },
            dialogs: {
                privateKey: {
                    open: false,
                    key: null
                },
                password: {
                    open: false
                }
            }
        }
        if (!keyHandler.isLoggedIn())
            window.location = constants.PAGE_WALLET_LOGIN
    }

    helpers = () => {
        const self = this
        return {
            toggleDrawer: (open) => {
                let drawer = self.state.drawer
                drawer.open = open
                self.setState({
                    drawer: drawer
                })
            },
            toggleDialog: (type, open) => {
                let dialogs = self.state.dialogs
                if (type == DIALOG_PASSWORD_ENTRY)
                    dialogs.password.open = open
                else if (type == DIALOG_PRIVATE_KEY)
                    dialogs.privateKey.open = open
                self.setState({
                    dialogs: dialogs
                })
            },
            getSelectedView: () => {
                switch (self.state.view) {
                    case VIEW_WALLET:
                        return <Wallet
                            selectedTokenContract={self.state.selectedTokenContract}
                        />
                    case VIEW_SEND:
                        return <Send/>
                }
            },
            logout: () => {
                window.location = constants.PAGE_WALLET_LOGOUT
            },
            showSnackbar: () => {
                let snackbar = self.state.snackbar
                snackbar.open = true
                self.setState({
                    snackbar: snackbar
                })
            },
            getMenuItemStyle: (tokenType) => {
                return (tokenType === self.state.selectedTokenContract) ?
                    styles.selectedMenuItem : styles.menuItem
            },
            selectTokenContract: (type) => {
                helper.setSelectedTokenContract(type)
                self.setState({
                    selectedTokenContract: type
                })
            }
        }
    }

    views = () => {
        const self = this
        return {
            appbar: () => {
                return <AppBar
                    zDepth={4}
                    style={styles.appbar}
                    className="appbar"
                    showMenuIconButton={true}
                    onLeftIconButtonTouchTap={() => {
                        self.helpers().toggleDrawer(!self.state.drawer.open)
                    }}
                    iconElementRight={self.views().appbarOptions()}
                />
            },
            appbarOptions: () => {
                return <section className="mt-1">
                    <FlatButton
                        label={<span className="fa fa-key"/>}
                        labelStyle={styles.addressLabel}
                        onClick={() => {
                            self.helpers().toggleDialog(DIALOG_PASSWORD_ENTRY, true)
                        }}
                    />
                    <FlatButton
                        className="hidden-md-down"
                        label={
                            <CopyToClipboard text={self.state.address}
                                             onCopy={() => self.helpers().showSnackbar()}>
                                <span>{self.state.address}</span>
                            </CopyToClipboard>}
                        labelStyle={styles.addressLabel}
                    />
                    <FlatButton
                        label="Log out"
                        className="mr-3"
                        onClick={self.helpers().logout}
                        labelStyle={{
                            fontFamily: 'TradeGothic'
                        }}
                    />
                </section>
            },
            selectedView: () => {
                return <div className="view">
                    {self.helpers().getSelectedView()}
                </div>
            },
            snackbar: () => {
                return <MuiThemeProvider muiTheme={themes.getSnackbar()}>
                    <Snackbar
                        message="Copied address to clipboard"
                        open={self.state.snackbar.open}
                        autoHideDuration={3000}
                    />
                </MuiThemeProvider>
            },
            drawer: () => {
                return <MuiThemeProvider muiTheme={themes.getDrawer()}>
                    <Drawer
                        docked={false}
                        width={300}
                        open={self.state.drawer.open}
                        onRequestChange={(open) => self.helpers().toggleDrawer(open)}>
                        <div className="container drawer">
                            <div className="row">
                                <div className="col-12 mt-4 hidden-sm-up">
                                    <FlatButton
                                        label="X"
                                        labelStyle={styles.drawerToggle}
                                        className="float-right"
                                        onClick={() => {
                                            self.helpers().toggleDrawer(false)
                                        }}
                                    />
                                </div>
                                <div className="col-12">
                                    <img className="logo"
                                         src={process.env.PUBLIC_URL + "/assets/img/logos/dbet-white.png"}/>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 hidden-sm-up">
                                <p className="address-mobile">
                                    {self.state.address}
                                    <CopyToClipboard text={self.state.address}
                                                     onCopy={() => self.helpers().showSnackbar()}>
                                        <span className="fa fa-clipboard color-gold ml-2 clickable menu-icon"/>
                                    </CopyToClipboard>
                                </p>
                            </div>
                        </div>
                        <List>
                            {self.views().drawerMenuItem('Trade DBETs', 'money', 'https://etherdelta.com/#DBET-ETH')}
                            {self.views().drawerMenuItem('DBET News', 'newspaper-o', 'https://www.decent.bet')}
                            {self.views().drawerMenuItem('Support', 'question', 'https://www.decent.bet/support')}
                            {self.views().tokenVersions()}
                            {self.views().drawerMenuItem('Version ' + versionNumber)}
                        </List>
                    </Drawer>
                </MuiThemeProvider>
            },
            drawerMenuItem: (label, icon, link) => {
                return <ListItem
                    className="menu-item"
                    style={styles.menuItem}
                    primaryText={label.toUpperCase()}
                    leftIcon={icon != null ? <span className={'fa fa-' + icon + ' menu-icon'}/> : null}
                    onClick={() => {
                        if (link)
                            window.open(link, '_blank')
                    }}/>
            },
            tokenVersions: () => {
                return <ListItem
                    className="menu-item"
                    primaryText="TOKEN VERSIONS"
                    style={styles.menuItem}
                    leftIcon={<span className={'fa fa-code-fork menu-icon'}/>}
                    initiallyOpen={true}
                    primaryTogglesNestedList={true}
                    nestedItems={[
                        <ListItem
                            key={2}
                            className="menu-item"
                            style={self.helpers().getMenuItemStyle(constants.TOKEN_TYPE_DBET_TOKEN_NEW)}
                            primaryText="V2 (CURRENT)"
                            onClick={() => {
                                self.helpers().selectTokenContract(constants.TOKEN_TYPE_DBET_TOKEN_NEW)
                            }}
                        />,
                        <ListItem
                            key={1}
                            className="menu-item"
                            style={self.helpers().getMenuItemStyle(constants.TOKEN_TYPE_DBET_TOKEN_OLD)}
                            primaryText="V1 (INITIAL)"
                            onClick={() => {
                                self.helpers().selectTokenContract(constants.TOKEN_TYPE_DBET_TOKEN_OLD)
                            }}
                        />
                    ]}
                />
            }
        }
    }

    dialogs = () => {
        const self = this
        return {
            passwordEntry: () => {
                return <PasswordEntryDialog
                    open={self.state.dialogs.password.open}
                    onValidPassword={(password) => {
                        let dialogs = self.state.dialogs
                        dialogs.privateKey.key = keyHandler.get(password)
                        self.setState({
                            dialogs: dialogs
                        })
                        self.helpers().toggleDialog(DIALOG_PASSWORD_ENTRY, false)
                        self.helpers().toggleDialog(DIALOG_PRIVATE_KEY, true)
                    }}
                    onClose={() => {
                        self.helpers().toggleDialog(DIALOG_PASSWORD_ENTRY, false)
                    }}
                />
            },
            privateKey: () => {
                return <ConfirmationDialog
                    title="Export Private Key"
                    message={"Your private key: " + self.state.dialogs.privateKey.key}
                    open={self.state.dialogs.privateKey.open}
                    onClick={() => {
                        self.helpers().toggleDialog(DIALOG_PRIVATE_KEY, false)
                    }}
                    onClose={() => {
                        self.helpers().toggleDialog(DIALOG_PRIVATE_KEY, false)
                    }}
                />
            }
        }
    }

    render() {
        const self = this
        return (
            <MuiThemeProvider muiTheme={themes.getAppBar()}>
                <div className="dashboard">
                    { self.views().appbar() }
                    { self.views().selectedView() }
                    { self.views().snackbar() }
                    { self.views().drawer() }
                    { self.dialogs().passwordEntry() }
                    { self.dialogs().privateKey() }
                </div>
            </MuiThemeProvider>)
    }

}

export default Dashboard