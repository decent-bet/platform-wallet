import React, {Component} from 'react'
import AppBar from 'material-ui/AppBar'
import FlatButton from 'material-ui/FlatButton'
import {MuiThemeProvider} from "material-ui"

import KeyHandler from '../Base/KeyHandler'
const keyHandler = new KeyHandler()

import Themes from './../Base/Themes'
const themes = new Themes()

import Helper from '../Helper'
const helper = new Helper()

import Wallet from './Wallet/Wallet'

const constants = require('../Constants')

import Send from "./Wallet/Send"

import './dashboard.css'

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
                        <section className="mt-1">
                            <FlatButton
                                label={self.state.address}
                                labelStyle={{
                                    color: constants.COLOR_GOLD,
                                    fontFamily: 'TradeGothic'
                                }}
                            />
                            <FlatButton
                                label={'Logout'}
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