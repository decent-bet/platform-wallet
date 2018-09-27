import React from 'react'
import { injectIntl } from 'react-intl'
import { componentMessages, getI18nFn } from '../../i18n/componentMessages'
import { Button } from '@material-ui/core'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import { Config } from '../Config'
import Helper from '../Helper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
const messages = componentMessages('src.Components.Wallet.WalletHeader', [
    'ViewAccountOnEtherscan',
    'Refresh'
])

const styles = () => ({
    header: {
        display: 'flex',
        flexFlow: 'row nowrap',
        justifyContent: 'space-between',
        margin: '10px 0px',
        '& > *': {
            flex: '0 auto'
        }
    }
})

const helper = new Helper()
const constants = require('../Constants')
// Reads the address from the 'data-address' attribute. Opens the account in Etherscan
function openUrlToHash(event) {
    let address = event.currentTarget.dataset.address
    if (address) {
        helper.openUrl(`${Config.etherscanUrl}/address/${address}`)
    }
}
function openUrlToVeforge(event) {
    let address = event.currentTarget.dataset.address
    if (address) {
        helper.openUrl(`${Config.veforgeUrl}/accounts/${address}`)
    }
}
function WalletHeader({
    classes,
    selectedTokenContract,
    intl,
    onRefreshListener,
    address
}) {
    const i18n = getI18nFn(intl, messages)
    const onClick =
        selectedTokenContract === constants.TOKEN_TYPE_DBET_TOKEN_VET
            ? openUrlToVeforge
            : openUrlToHash
    const addressMessage =
        selectedTokenContract === constants.TOKEN_TYPE_DBET_TOKEN_VET
            ? 'View account on Veforge'
            : i18n('ViewAccountOnEtherscan')

    return (
        <header className={classes.header}>
            <Button onClick={onClick} data-address={address}>
                {addressMessage}
            </Button>
            <Button onClick={onRefreshListener}>
                <FontAwesomeIcon icon="sync" style={{ marginRight: '0.6em' }} />
                {i18n('Refresh')}
            </Button>
        </header>
    )
}

WalletHeader.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(injectIntl(WalletHeader))
