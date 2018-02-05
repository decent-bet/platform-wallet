import React from 'react'
import ReactDOM from 'react-dom'

import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

import App from './Components/App'

import './css/bootstrap.min.css'
import './css/font-awesome.min.css'
import './css/main.css'

ReactDOM.render(<App />, document.getElementById('root'))
