import React from 'react'
import ReactDOM from 'react-dom'
import {Router, Route, browserHistory} from 'react-router'

import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

import Login from './Components/Login/Login'

import './css/bootstrap.min.css'
import './css/font-awesome.min.css'
import './css/main.css'

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path="/" component={Login}/>
    </Router>,
    document.getElementById('root')
)