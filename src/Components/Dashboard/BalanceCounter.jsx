import React from 'react'
import { Button } from '@material-ui/core'
import { injectIntl } from 'react-intl'
import { componentMessages, getI18nFn } from '../../i18n/componentMessages'

const styles = require('../Base/styles').styles

const messages = componentMessages('src.Components.Dashboard.BalanceCounter', [
    { Loading: 'common.Loading' },
    'EthereumBalance'
])

function BalanceCounter({ intl, isLoading, balance, currency }) {
    const i18n = getI18nFn(intl, messages)
    // const balanceLabel = (currency === 'ETH') ? i18n('EthereumBalance') : currency
    const balanceLabel = currency
    // labelStyle={styles.addressLabel}

    return (
        <Button
            className="hidden-md-down mx-auto address-label"
        >
            <span className="value-label">
                {balanceLabel}
                <span className="value">
                    {isLoading ? i18n('Loading') : balance}
                </span>
            </span>
        </Button>
    )
}
export default injectIntl(BalanceCounter)
