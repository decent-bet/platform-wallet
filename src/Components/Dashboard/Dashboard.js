import React, {Component} from 'react'

import {AppBar, Drawer, FlatButton, MenuItem, MuiThemeProvider, Snackbar} from 'material-ui'
import {CopyToClipboard} from 'react-copy-to-clipboard'

import ConfirmationDialog from '../Base/Dialogs/ConfirmationDialog'
import Wallet from '../Wallet/Wallet'
import Send from "../Wallet/Send"

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

class Dashboard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            view: props.view,
            address: helper.getWeb3().eth.defaultAccount,
            ethNetwork: 0,
            balance: 0,
            drawer: {
                open: false
            },
            snackbar: {
                open: false
            },
            dialogs: {
                privateKey: {
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
            togglePrivateKeyDialog: (open) => {
                let dialogs = self.state.dialogs
                dialogs.privateKey.open = open
                self.setState({
                    dialogs: dialogs
                })
            },
            getSelectedView: () => {
                switch (self.state.view) {
                    case VIEW_WALLET:
                        return <Wallet
                            onSend={() => {
                                window.location = '/wallet/send'
                            }}
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
                            self.helpers().togglePrivateKeyDialog(true)
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
                        label="Logout"
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
                        <div>
                            {self.views().drawerMenuItem('Trade DBETs', 'money', 'https://etherdelta.com/#DBET-ETH')}
                            {self.views().drawerMenuItem('DBET News', 'newspaper-o', 'https://www.decent.bet')}
                            {self.views().drawerMenuItem('Support', 'question', 'https://www.decent.bet/support')}
                            {self.views().drawerMenuItem('Version ' + versionNumber)}
                        </div>
                    </Drawer>
                </MuiThemeProvider>
            },
            drawerMenuItem: (label, icon, link) => {
                return <MenuItem
                    className="menu-item"
                    style={styles.menuItem}
                    onClick={() => {
                        if (link)
                            window.open(link, '_blank')
                    }}>
                    { icon != null &&
                    <span className={'fa fa-' + icon + ' menu-icon'}/>
                    }
                    &ensp;&ensp;{label.toUpperCase()}
                </MenuItem>
            }
        }
    }

    dialogs = () => {
        const self = this
        return {
            privateKey: () => {
                return <ConfirmationDialog
                    title="Export Private Key"
                    message={"Your private key: " + keyHandler.get()}
                    open={self.state.dialogs.privateKey.open}
                    onClick={() => {
                        self.helpers().togglePrivateKeyDialog(false)
                    }}
                    onClose={() => {
                        self.helpers().togglePrivateKeyDialog(false)
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
                    { self.dialogs().privateKey() }
                </div>
            </MuiThemeProvider>)
    }

}

export default Dashboard