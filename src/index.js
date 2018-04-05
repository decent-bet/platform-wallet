import React from 'react'
import ReactDOM from 'react-dom'
import { IntlProvider, addLocaleData } from 'react-intl'
//Could be loaded with require and slightly more convenient
// object structure and loops but import is preferable
import localeEN from 'react-intl/locale-data/en'
import localeES from 'react-intl/locale-data/es'
import localeJA from 'react-intl/locale-data/ja'
import i18nMessages from './i18n'
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
const language = 'ja' //TODO: get from electron's app.getLocale() or saved setting
switch (language.slice(0, 2)) { // Could load all into memory to allow faster switching
    case 'en':
        addLocaleData(localeEN)
        break
    case 'es':
        addLocaleData(localeES)
        break
    case 'ja':
        addLocaleData(localeJA)
        break
}

// Split locales with a region code
const languageWithoutRegionCode = language.toLowerCase().split(/[_-]+/)[0]
// Try full locale, try locale without region code, fallback to 'en'
const messages =
    i18nMessages[languageWithoutRegionCode] ||
    i18nMessages[language] ||
    i18nMessages.en
ReactDOM.render(
    <IntlProvider locale={language} messages={messages}>
        <App />
    </IntlProvider>,
    document.getElementById('root')
)
