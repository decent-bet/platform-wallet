import React from 'react'
import ReactDOM from 'react-dom'
import { IntlProvider } from 'react-intl'
import i18n from './i18n/'
import injectTapEventPlugin from 'react-tap-event-plugin'


import './css/bootstrap.min.css'
import './css/main.css'

//Initialize Fontawesome
import fontAwesome from '@fortawesome/fontawesome'
import fontAwesomeSolid from '@fortawesome/fontawesome-free-solid'

// Initialize App
import App from './Components/App'
injectTapEventPlugin()

fontAwesome.library.add(fontAwesomeSolid)
let language = i18n.getLanguage()
let messages = i18n.getMessagesForLanguage(language)

ReactDOM.render(
    <IntlProvider locale={language} messages={messages}>
        <App />
    </IntlProvider>,
    document.getElementById('root')
)
