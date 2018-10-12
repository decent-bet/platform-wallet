import React from 'react'
import ReactDOM from 'react-dom'
import { IntlProvider } from 'react-intl'
import i18n from './i18n'

import './css/bootstrap.min.css'
import './css/main.css'

// Load Fontawesome
import { library } from '@fortawesome/fontawesome-svg-core'
import faSolid from '@fortawesome/fontawesome-free-solid'
import { faEthereum } from '@fortawesome/fontawesome-free-brands'
library.add(faSolid, faEthereum)
// Initialize App
import App from './Components/App'

import * as serviceWorker from './serviceWorker';
let language = i18n.getLanguage()
let messages = i18n.getMessagesForLanguage(language)

ReactDOM.render(
        <IntlProvider locale={language} messages={messages}>
            <App />
        </IntlProvider>,
    document.getElementById('root')
)



serviceWorker.unregister();