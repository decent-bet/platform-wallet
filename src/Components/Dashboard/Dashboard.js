import React, {Component} from 'react'

import {AppBar, Drawer, FlatButton, MenuItem, MuiThemeProvider, Snackbar} from 'material-ui'
import {CopyToClipboard} from 'react-copy-to-clipboard'

import Wallet from './Wallet/Wallet'
import Send from "./Wallet/Send"

import Helper from '../Helper'
import KeyHandler from '../Base/KeyHandler'
import Themes from './../Base/Themes'

import './dashboard.css'

const versionNumber = require('../../../package.json').version;

const keyHandler = new KeyHandler()
const themes = new Themes()
const helper = new Helper()

const constants = require('../Constants')
const styles = require('../Base/styles').styles

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
                    iconElementRight={
                        <section className="mt-1">
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
                    }
                />
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
                        <div>
                            <MenuItem
                                className="menu-item"
                                style={styles.menuItem}
                                onClick={() => {
                                    window.open('https://etherdelta.com/#DBET-ETH', '_blank')
                                }}>
                                <span className="fa fa-money menu-icon"/>&ensp;&ensp;TRADE DBETs
                            </MenuItem>
                            <MenuItem
                                className="menu-item"
                                style={styles.menuItem}
                                onClick={() => {
                                    window.open('https://www.decent.bet', '_blank')
                                }}>
                                <span className="fa fa-newspaper-o menu-icon"/>&ensp;&ensp;DBET NEWS
                            </MenuItem>
                            <MenuItem
                                className="menu-item"
                                style={styles.menuItem}
                                onClick={() => {
                                    window.open('https://facebook.com/decentbet', '_blank')
                                }}>
                                <span className="fa fa-facebook-square menu-icon"/>&ensp;&ensp;FACEBOOK
                            </MenuItem>
                            <MenuItem
                                className="menu-item"
                                style={styles.menuItem}
                                onClick={() => {
                                    window.open('https://www.youtube.com/channel/UCItUzfVU_mlZsU9FJegg3LA', '_blank')
                                }}>
                                <span className="fa fa-youtube-play menu-icon"/>&ensp;&ensp;YOUTUBE
                            </MenuItem>
                            <MenuItem
                                className="menu-item"
                                style={styles.menuItem}
                                onClick={() => {
                                    window.open('https://www.twitter.com/decent_bet/', '_blank')
                                }}>
                                <span className="fa fa-twitter-square menu-icon"/>&ensp;&ensp;TWITTER
                            </MenuItem>
                            <MenuItem
                                className="menu-item"
                                style={styles.menuItem}
                                onClick={() => {
                                    window.open('https://reddit.com/r/decentbet', '_blank')
                                }}>
                                <span className="fa fa-reddit menu-icon"/>&ensp;&ensp;REDDIT
                            </MenuItem>
                            <MenuItem
                                className="menu-item"
                                style={styles.menuItem}
                                onClick={() => {
                                }}>
                                &ensp;&ensp;VERSION {versionNumber}
                            </MenuItem>
                        </div>
                    </Drawer>
                </MuiThemeProvider>
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
                </div>
            </MuiThemeProvider>)
    }

}

export default Dashboard