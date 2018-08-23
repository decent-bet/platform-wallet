import React from 'react'
import { FlatButton } from 'material-ui'
import { injectIntl } from 'react-intl'
import { componentMessages, getI18nFn } from '../../i18n/componentMessages'

const styles = require('../Base/styles').styles

const messages = componentMessages(
    'src.Components.Dashboard.BalanceCounter',
    [{ Loading: 'common.Loading' }, 'EthereumBalance']
)

function BalanceCounter({ intl, isLoading, balance, currency }) {
    const i18n = getI18nFn(intl, messages)
    // const balanceLabel = (currency === 'ETH') ? i18n('EthereumBalance') : currency
    const balanceLabel = currency
    return (
        <FlatButton
            className="hidden-md-down mx-auto address-label"
            label={
                <span className="value-label">
                    {balanceLabel}
                    <span className="value">
                        {isLoading ? i18n('Loading') : balance}
                    </span>
                </span>
            }
            labelStyle={styles.addressLabel}
        />
    )
}
export default injectIntl(BalanceCounter)
