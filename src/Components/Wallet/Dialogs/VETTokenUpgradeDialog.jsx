import React, { Component } from 'react'
import {
    Dialog,
    DialogActions,
    DialogContent,
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
function VETTokenUpgradeDialogInner({
    currentEtherBalance,
    currentV1TokenBalance,
    currentV2TokenBalance,
    status
}) {
    if (currentEtherBalance === 0) {
        // Error Message: Print this if there is no Ether in the account
        return (
            <div>
                <Typography className="text-info">
                    ETH needed to complete the upgrade
                </Typography>
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
    } else if (currentV1TokenBalance > 0 && currentV2TokenBalance < 1) {
        return (
            <div>
                <Typography>
                    {currentV1TokenBalance} DBETs will be updated from contract
                    v1 to VET. Are you sure you would like to continue?
                </Typography>
                <br />
                <MigrationProgress status={status} />
                <br />
                <Typography className="text-info">
                    Ether will be discounted from your wallet to cover Gas costs
                </Typography>
            </div>
        )
    } else if (currentV1TokenBalance < 1 && currentV2TokenBalance > 0) {
        return (
            <div>
                <Typography>
                    {currentV2TokenBalance} DBETs will be updated from contract
                    v2 to VET. Are you sure you would like to continue?
                </Typography>
                <br />
                <MigrationProgress status={status} />
                <br />
                <Typography className="text-info">
                    Ether will be discounted from your wallet to cover Gas costs
                </Typography>
            </div>
        )
    } else {
        // Normal Message: Transfer details and pricing warning
        return (
            <div>
                <Typography>
                    {currentV1TokenBalance} v1 and {currentV2TokenBalance} v2
                    DBETs will be updated to VET. Are you sure you would like to
                    continue?
                </Typography>
                <br />
                <MigrationProgress status={status} />
                <br />
                <Typography className="text-info">
                    Ether will be discounted from your wallet to cover Gas costs
                </Typography>
            </div>
        )
    }
}

function MigrationProgress({ status }) {
    if (status) {
        return (
            <div>
                <Typography color="primary">Current Status</Typography>
                <Typography>{status}</Typography>
            </div>
        )
    }
    return <div />
}
class VETTokenUpgradeDialog extends Component {
    constructor(props) {
        super(props)
        i18n = getI18nFn(props.intl, messages)
        TOKEN_BALANCE_LOADING = i18n('Loading')
        this.state = {
            open: props.open,
            v1TokenBalance: props.v1Balance,
            v2TokenBalance: props.v2Balance,
            ethBalance: props.ethBalance,
            timeElapsed: props.timeElapsed,
            status: props.status,
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
            props.v1Balance !== state.v1Balance ||
            props.v2TokenBalance !== state.v2TokenBalance ||
            props.timeElapsed !== state.timeElapsed ||
            props.ethBalance !== state.ethBalance
        ) {
            return {
                timeElapsed: props.timeElapsed,
                status: props.status,
                open: props.open,
                v1TokenBalance: props.v1Balance,
                v2TokenBalance: props.v2Balance,
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
            this.state.v1TokenBalance === TOKEN_BALANCE_LOADING ||
            this.state.v2TokenBalance === TOKEN_BALANCE_LOADING

        return (
            <Dialog
                disableBackdropClick={true}
                disableEscapeKeyDown={true}
                open={this.state.open}
                onClose={this.props.onClose}
            >
                <DialogTitle>VET Token Swap</DialogTitle>
                <DialogContent>
                    <div>
                        <Typography color="primary">
                            VET Destination Address
                        </Typography>
                        <Typography>{this.props.vetAddress}</Typography>
                    </div>
                    <br />
                    <div>
                        <Typography color="primary">
                            Upgrade Information
                        </Typography>
                    </div>
                    <VETTokenUpgradeDialogInner
                        currentEtherBalance={currentEtherBalance}
                        currentV1TokenBalance={this.state.v1TokenBalance}
                        currentV2TokenBalance={this.state.v2TokenBalance}
                        timeElapsed={this.state.timeElapsed}
                        status={this.state.status}
                    />
                    <DialogActions>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={buttonDisabled}
                            onClick={this.props.onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={buttonDisabled}
                            onClick={this.onUpgrade}
                        >
                            Upgrade
                        </Button>
                    </DialogActions>
                </DialogContent>
            </Dialog>
        )
    }
}

export default injectIntl(VETTokenUpgradeDialog)
