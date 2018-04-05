import { defineMessages } from 'react-intl'

/**
 * Convenience method for intl.formatMessage
 * @param intl:Object Parameter received from injectIntl
 * @param messages:Object Result of componentMessages or defineMessages
 * @returns {function(string): (*|string)}
 *
 */
const getI18nFn = (intl, messages) => (msg, values) => {
    if (!messages.hasOwnProperty(msg)) {
        const k = Object.keys(messages)
        throw new ReferenceError(
            `i18n.componentMessages.18n: Unable to find requested key: "${msg}" in ${
                k.length
            } defined component-level messages constant: "${k}"`
        )
    }
    const result = intl.formatMessage(messages[msg], values)
    if (result === messages[msg].id) {
        throw new ReferenceError(
            `i18n.componentMessages.18n:
            Unable to find requested key: "${
                messages[msg].id
            }" in project-level language definition`
        )
    }
    return result
}

/**
 * Convenience method for defineMessages
 * @param nameSpace:string
 * @param messages:Array<string|Object> Array of either strings (each will be considered part
 * of defined namespace), or an key/value object to specify an alternate
 * namespace on a one-off basis.
 * @returns {ReactIntl.Messages}
 */
const componentMessages = (nameSpace, messages) => {
    let intlMessages = {}
    for (let i = 0; i < messages.length; i++) {
        // if no ID is passed, just a string, assume NS + id
        if (typeof messages[i] === 'string') {
            intlMessages[messages[i]] = { id: `${nameSpace}.${messages[i]}` }
        } else {
            // use the FQ message ID
            // key is an object for lookup by i18n, value is full namespace+id
            const key = Object.keys(messages[i])[0]
            intlMessages[key] = { id: Object.values(messages[0])[0] }
        }
    }
    return defineMessages(intlMessages)
}

export { getI18nFn, componentMessages }
