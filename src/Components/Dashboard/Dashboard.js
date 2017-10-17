import React, {Component} from 'react'
import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton'
import KeyHandler from '../Base/KeyHandler'
const keyHandler = new KeyHandler()
import Themes from './../Base/Themes'
const themes = new Themes()
import Helper from '../Helper'
const helper = new Helper()
import Wallet from './Wallet/Wallet'
const constants = require('../Constants')
import './dashboard.css'
import Send from "./Wallet/Send"
import {MuiThemeProvider} from "material-ui"

const VIEW_WALLET = 0
const VIEW_SEND = 1

class Dashboard extends Component {

    constructor(props) {
        super(props)
        this.state = {
            view: VIEW_SEND,
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
                    case constants.ETHEREUM_NETWORK_LOADING:
                        return "Loading.."
                    case constants.ETHEREUM_NETWORK_MAINNET:
                        return 'Ethereum Mainnet'
                    case constants.ETHEREUM_NETWORK_MORDEN:
                        return 'Morden test network'
                    case constants.ETHEREUM_NETWORK_ROPSTEN:
                        return 'Ropsten test network'
                    case constants.ETHEREUM_NETWORK_RINKEBY:
                        return 'Rinkeby test network'
                    case constants.ETHEREUM_NETWORK_KOVAN:
                        return 'Kovan test network'
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
                    case VIEW_SEND:
                        return <Send/>
                }
            },
            logout: () => {
                window.location = constants.PAGE_WALLET_LOGOUT
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
                    iconElementRight={
                        <FlatButton
                            label={'Logout'}
                            onClick={self.helpers().logout}
                        />
                    }
                />
            },
            selectedView: () => {
                return <div className="view">
                    {self.helpers().getSelectedView()}
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
                    {self.views().selectedView()}
                </div>
            </MuiThemeProvider>)
    }

}

export default Dashboard