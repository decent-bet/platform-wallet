import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, IndexRoute, Redirect, browserHistory} from 'react-router'

import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

import Web3Loader from './Components/Base/Web3Loader'

import App from './Components/App'
import Login from './Components/Login/Login'
import NewWallet from './Components/NewWallet/NewWallet'
import Dashboard from './Components/Dashboard'

import KeyHandler from './Components/Base/KeyHandler'

import './css/bootstrap.min.css'
import './css/font-awesome.min.css'
import './css/main.css'

const keyHandler = new KeyHandler()
/** Asynchronously load web3 object */
const web3Loader = new Web3Loader()

const constants = require('./Components/Constants')

let replaceUrl = (url) => {
    if (window.history.replaceState)
        window.history.replaceState('', document.title, url)
}

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/wallet" component={App}>
            <IndexRoute component={() => {
                if (keyHandler.isLoggedIn()) {
                    web3Loader.init()
                    return <Dashboard
                        view={constants.VIEW_WALLET}
                    />
                } else {
                    replaceUrl('/wallet/login')
                    return <Login/>
                }
            }}/>
            <Route path="send" component={() => {
                return <Dashboard
                    view={constants.VIEW_SEND}
                />
            }}/>
            <Route path="login" component={() => {
                if (keyHandler.isLoggedIn()) {
                    replaceUrl('/wallet')
                    return <Dashboard
                        view={constants.VIEW_WALLET}
                    />
                } else {
                    replaceUrl('/wallet/login')
                    return <Login/>
                }
            }}/>
            <Route path="new" component={() => {
                if (keyHandler.isLoggedIn()) {
                    replaceUrl('/wallet')
                    return <Dashboard
                        view={constants.VIEW_WALLET}
                    />
                } else
                    return <NewWallet/>
            }}/>
            <Route path="logout" component={() => {
                keyHandler.clear()
                replaceUrl('/wallet/login')
                return <Login/>
            }}/>
        </Route>
        <Redirect from="/" to="/wallet"/>
    </Router>,
    document.getElementById('root')
)