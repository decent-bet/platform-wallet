import { addLocaleData } from 'react-intl'
import localeZH from 'react-intl/locale-data/zh'
import localeJA from 'react-intl/locale-data/ja'
import localeEN from 'react-intl/locale-data/en'
import localeKO from 'react-intl/locale-data/ko'
// import localeES from 'react-intl/locale-data/es'

import Helper from '../Components/Helper'
import messages from './messages/'

const constants = require('../Components/Constants')

addLocaleData(localeEN)
addLocaleData(localeJA)
addLocaleData(localeZH)
addLocaleData(localeKO)
// addLocaleData(localeES)

class i18n {
    static getLanguage() {
        let lang = localStorage.getItem(constants.I18N_LANGUAGE_SET)
        return lang || 'en'
    }

    static setLanguage(language) {
        localStorage.setItem(constants.I18N_LANGUAGE_SET, language)
        window.location.reload()
    }

    static getMessagesForLanguage(language) {
        return messages[language]
    }
}

export default i18n