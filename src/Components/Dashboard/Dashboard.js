/**
 * Created by user on 9/11/2017.
 */

import React, {Component} from 'react'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'

import KeyHandler from '../Base/KeyHandler'
const keyHandler = new KeyHandler()

import Themes from './../Base/Themes'
const themes = new Themes()

import Helper from '../Helper'
const helper = new Helper()

import Wallet from './Wallet/Wallet'

const constants = require('../Constants')

import './dashboard.css'

const styles = {
    menuItem: {
        color: constants.COLOR_WHITE,
        fontFamily: 'GothamLight',
        fontSize: 17,
        padding: '10px 0 10px 0'
    }
}

const VIEW_WALLET = 0

class Dashboard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            view: VIEW_WALLET,
            ethNetwork: 0,
            balance: 0,
            drawer: {
                open: false
            }
        }
        if (!keyHandler.isLoggedIn())
            window.location = constants.PAGE_WALLET_LOGIN
    }

    helpers = () => {
        const self = this
        return {
            getEthereumNetwork: () => {
                switch (this.state.ethNetwork) {
                    case "0":
                        return "Loading.."
                    case "1":
                        return 'Ethereum Mainnet'
                    case "2":
                        return 'Morden test network'
                    case "3":
                        return 'Ropsten test network'
                    default:
                        return 'Private test network'
                }
            },
            toggleDrawer: (open) => {
                let drawer = self.state.drawer
                drawer.open = open
                self.setState({
                    drawer: drawer
                })
            },
            setView: (view) => {
                self.setState({
                    view: view
                })
            },
            getSelectedView: () => {
                switch (self.state.view) {
                    case VIEW_WALLET:
                        return <Wallet/>
                }
            }
        }
    }

    views = () => {
        const self = this
        return {
            appbar: () => {
                return <AppBar
                    zDepth={4}
                    style={{
                        position: 'fixed',
                        top: 0
                    }}
                    className="appbar"
                    showMenuIconButton={true}
                    onLeftIconButtonTouchTap={() => {
                        self.helpers().toggleDrawer(!self.state.drawer.open)
                    }}
                    title={
                        <div className="appbar-title">
                            <a href="/">
                                <img src={process.env.PUBLIC_URL + "/assets/img/logos/dbet-white.png"}
                                     className="logo"/>
                            </a>
                        </div>
                    }
                />
            },
            drawer: () => {
                return <Drawer
                    docked={false}
                    width={300}
                    open={self.state.drawer.open}
                    onRequestChange={(open) => self.helpers().toggleDrawer(open)}
                >
                    <div className="container drawer">
                        <div className="row">
                            <div className="col">
                                <img className="logo"
                                     src={process.env.PUBLIC_URL + "/assets/img/logos/dbet-white.png"}/>
                            </div>
                        </div>
                    </div>
                    <div>
                        <MenuItem
                            className="menu-item"
                            style={styles.menuItem}>
                            <span className="fa fa-google-wallet menu-icon"/>&ensp;&ensp;WALLET
                        </MenuItem>
                        <MenuItem
                            className="menu-item"
                            style={styles.menuItem}>
                            <span className="fa fa-paper-plane-o menu-icon"/>&ensp;&ensp;SEND
                        </MenuItem>
                        <MenuItem
                            className="menu-item"
                            style={styles.menuItem}>
                            <span className="fa fa-list menu-icon"/>&ensp;&ensp;TRANSACTIONS
                        </MenuItem>
                        <MenuItem
                            className="menu-item"
                            style={styles.menuItem}
                            onClick={() => {
                                window.location = constants.PAGE_WALLET_LOGOUT
                            }}>
                            <span className="fa fa-power-off menu-icon"/>&ensp;&ensp;LOGOUT
                        </MenuItem>
                    </div>
                </Drawer>
            },
            selectedView: () => {
                return <div className="view">
                    { self.helpers().getSelectedView() }
                </div>
            }
        }
    }

    render() {
        const self = this
        return (
            <MuiThemeProvider muiTheme={themes.getAppBar()}>
                <div className="dashboard">
                    {self.views().appbar()}
                    {self.views().drawer()}
                    {self.views().selectedView()}
                </div>
            </MuiThemeProvider>)
    }

}

export default Dashboard