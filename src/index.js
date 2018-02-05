import React from 'react'
import ReactDOM from 'react-dom'

import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

import './css/bootstrap.min.css'
import './css/main.css'

//Initialize Fontawesome
import fontAwesome from '@fortawesome/fontawesome'
import fontAwesomeSolid from '@fortawesome/fontawesome-free-solid'
fontAwesome.library.add(fontAwesomeSolid)

// Initialize App
import App from './Components/App'
let app = React.createElement(App)
ReactDOM.render(app, document.getElementById('root'))
