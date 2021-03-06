import React, { Component } from 'react'
import {
    Dialog,
    DialogContent,
    DialogActions,
    DialogTitle,
    Button,
    Typography
} from '@material-ui/core'
import { injectIntl } from 'react-intl'
import { componentMessages, getI18nFn } from '../../../i18n/componentMessages'
let i18n
const messages = componentMessages(
    'src.Components.Wallet.Dialogs.TokenUpgradeDialog',
    [{ Loading: 'common.Loading' }]
)

let TOKEN_BALANCE_LOADING
// Inner text of the dialog
function TokenUpgradeDialogInner({ currentEtherBalance, currentTokenBalance }) {
    if (currentEtherBalance === 0) {
        // Error Message: Print this if there is no Ether in the account
        return (
            <div>
                <Typography className="text-info">ETH needed to complete the upgrade</Typography>
                <Typography>
                    This account currently has 0 ether (ETH), but it needs some
                    to be able to cover the gas cost of upgrading the tokens.
                </Typography>
                <Typography>
                    Please send some ether to this account (e.g. 0.03 ETH), and
                    then try again once it has been received. After you send the
                    ETH, you can click the refresh icon on the main page to
                    check if it has been received.
                </Typography>
            </div>
        )
    } else {
        // Normal Message: Transfer details and pricing warning
        return (
            <div>
                <Typography>
                    {currentTokenBalance} DBETs will be updated from the initial
                    contract (v1) to the current contract (v2). Are you sure you
                    would like to continue?
                </Typography>
                <Typography className="text-info">
                    Ether will be discounted from your wallet to cover Gas costs
                </Typography>
            </div>
        )
    }
}

class TokenUpgradeDialog extends Component {
    constructor(props) {
        super(props)
        i18n = getI18nFn(props.intl, messages)
        TOKEN_BALANCE_LOADING = i18n('Loading')
        this.state = {
            open: props.open,
            tokenBalance: props.balance,
            ethBalance: props.ethBalance,
            loading: false,
            errors: {
                address: false,
                gasPrice: false
            }
        }

        // Bind the 'this' keyword
        this.onUpgrade = this.onUpgrade.bind(this)
    }

    static getDerivedStateFromProps(props, state) {
        if (
            props.open !== state.open ||
            props.tokenBalance !== state.balance ||
            props.ethBalance !== state.ethBalance
        ) {
            return {
                open: props.open,
                tokenBalance: props.balance,
                ethBalance: props.ethBalance
            }
        }
        return null
    }

    onUpgrade() {
        // Upgrade button pressed
        this.props.onUpgrade()
        this.setState({
            loading: true
        })
    }

    render() {
        let currentEtherBalance = parseFloat(this.state.ethBalance)
        let buttonDisabled =
            currentEtherBalance === 0 ||
            this.state.loading ||
            this.state.tokenBalance === TOKEN_BALANCE_LOADING

        return (
            <Dialog
                open={this.state.open}
                onClose={this.props.onClose}
            >
                <DialogTitle>Token Upgrade</DialogTitle>
                <DialogContent>
                    <TokenUpgradeDialogInner
                        currentEtherBalance={currentEtherBalance}
                        currentTokenBalance={this.state.tokenBalance}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={buttonDisabled}
                        onClick={this.onUpgrade}
                    >Upgrade</Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default injectIntl(TokenUpgradeDialog)
