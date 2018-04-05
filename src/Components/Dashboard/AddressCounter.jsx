import React from 'react'
import { FlatButton } from 'material-ui'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { injectIntl } from 'react-intl'
import { componentMessages, getI18nFn } from '../../i18n/componentMessages'

const messages = componentMessages('src.Components.Dashboard.AddressCounter', [
    'PublicAddress'
])
const styles = require('../Base/styles').styles

function AddressCounter({ intl, address, listener }) {
    const i18n = getI18nFn(intl, messages)
    return (
        <FlatButton
            className="hidden-md-down"
            label={
                <CopyToClipboard text={address} onCopy={listener}>
                    <span className="value-label">
                        {i18n('PublicAddress')}
                        <span className="value">{address}</span>
                    </span>
                </CopyToClipboard>
            }
            labelStyle={styles.addressLabel}
        />
    )
}
export default injectIntl(AddressCounter)
