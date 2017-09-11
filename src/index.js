import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, browserHistory} from 'react-router'

import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

import MetaMaskLoader from './Components/Base/MetaMaskLoader'

import Login from './Components/Login/Login'
import NewWallet from './Components/NewWallet/NewWallet'
import Dashboard from './Components/Dashboard/Dashboard'

import KeyHandler from './Components/Base/KeyHandler'
const keyHandler = new KeyHandler()

const constants = require('./Components/Constants')

const metaMaskLoader = new MetaMaskLoader()

import './css/bootstrap.min.css'
import './css/font-awesome.min.css'
import './css/main.css'


metaMaskLoader.setOnLoadMetaMaskListener(() => {
    ReactDOM.render(
        <Router history={browserHistory}>
            <Route path="/" component={keyHandler.isLoggedIn() ? Dashboard : Login}/>
            <Route path="/wallet" component={Dashboard}/>
            <Route path="/wallet/login" component={Login}/>
            <Route path="/wallet/new" component={NewWallet}/>
            <Route path="/wallet/logout" component={() => {
                keyHandler.clear()
                window.location = constants.PAGE_WALLET_LOGIN
            }}/>

        </Router>,
        document.getElementById('root')
    )
})