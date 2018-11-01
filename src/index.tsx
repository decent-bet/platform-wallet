import React from 'react'
import ReactDOM from 'react-dom'
import { IntlProvider } from 'react-intl'
import i18n from './i18n'

import './css/bootstrap.min.css'
import './css/main.css'

// Load Fontawesome
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faEthereum } from '@fortawesome/free-brands-svg-icons'
library.add(fas, faEthereum)
// Initialize App
import App from './Components/App'

let language = i18n.getLanguage()
let messages = i18n.getMessagesForLanguage(language)

dom.watch()
ReactDOM.render(
        <IntlProvider locale={language} messages={messages}>
            <App />
        </IntlProvider>,
    document.getElementById('root')
)
