import React from 'react'
import { Button } from '@material-ui/core'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { injectIntl } from 'react-intl'
import { componentMessages, getI18nFn } from '../../i18n/componentMessages'

const messages = componentMessages('src.Components.Dashboard.AddressCounter', [
    'PublicAddress'
])
const styles = require('../Base/styles').styles

function AddressCounter({ intl, address, listener }) {
    const i18n = getI18nFn(intl, messages)
    // labelStyle={styles.addressLabel}
    return (
        <Button className="hidden-md-down">
            <CopyToClipboard text={address} onCopy={listener}>
                <span className="value-label">
                    {i18n('PublicAddress')}
                    <span className="value">{address}</span>
                </span>
            </CopyToClipboard>
        </Button>
    )
}
export default injectIntl(AddressCounter)
