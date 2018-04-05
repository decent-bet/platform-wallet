import React from 'react'
import { FlatButton } from 'material-ui'
import { injectIntl } from 'react-intl'
import { componentMessages, getI18nFn } from '../../i18n/componentMessages'

const constants = require('../Constants')
const styles = require('../Base/styles').styles

const messages = componentMessages(
    'src.Components.Dashboard.EtherBalanceCounter',
    [{ Loading: 'common.Loading' }, 'EthereumBalance']
)

function EtherBalanceCounter({ intl, isLoading, balance }) {
    const i18n = getI18nFn(intl, messages)
    return (
        <FlatButton
            className="hidden-md-down mx-auto address-label"
            label={
                <span className="value-label">
                    {i18n('EthereumBalance')}
                    <span className="value">
                        {isLoading ? i18n('Loading') : balance}
                    </span>
                </span>
            }
            labelStyle={styles.addressLabel}
        />
    )
}
export default injectIntl(EtherBalanceCounter)
