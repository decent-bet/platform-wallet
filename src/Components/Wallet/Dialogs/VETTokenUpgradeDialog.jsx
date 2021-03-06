import React, { Component, Fragment } from 'react'
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Typography
} from '@material-ui/core'
import BigNumber from 'bignumber.js'
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
    status,
    gasCost,
}) {
    const V1Balance = new BigNumber(currentV1TokenBalance)
    const V2Balance = new BigNumber(currentV2TokenBalance)
    
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
    } else if (V1Balance.isGreaterThan(0) && V2Balance.isLessThanOrEqualTo(0)) {
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
                <RenderGasEstimates etherBalance={currentEtherBalance} gasCost={gasCost}></RenderGasEstimates>
            </div>
        )
    } else if (V1Balance.isLessThanOrEqualTo(0) && V2Balance.isGreaterThan(0)) {
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
                <RenderGasEstimates etherBalance={currentEtherBalance} gasCost={gasCost}></RenderGasEstimates>
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
                <RenderGasEstimates etherBalance={currentEtherBalance} gasCost={gasCost}></RenderGasEstimates>
            </div>
        )
    }
}

function RenderGasEstimates({ etherBalance, gasCost }) {
    return (
        <Fragment>
            <Typography className="text-info">
                <small>Gas cost: {gasCost}</small>
                <br />
                <small>ETH balance: {etherBalance} ETH</small>
            </Typography>
        </Fragment>
    )
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
            swapGasCost: props.swapGasCost,
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
            },
            upgrading: false
        }
        
    }

    static getDerivedStateFromProps(props, state) {
        if (
            props.open !== state.open ||
            props.v1Balance !== state.v1Balance ||
            props.v2TokenBalance !== state.v2TokenBalance ||
            props.timeElapsed !== state.timeElapsed ||
            props.ethBalance !== state.ethBalance
        ) {
            let res = {
                timeElapsed: props.timeElapsed,
                status: props.status,
                open: props.open,
                v1TokenBalance: props.v1Balance,
                v2TokenBalance: props.v2Balance,
                ethBalance: props.ethBalance,
                swapGasCost: props.swapGasCost,
            }
            if (!props.status) {
                res.loading = false
            }
            return res
        }
        return null
    }

    onUpgrade = ()=> {
        // Upgrade button pressed
        this.props.onUpgrade()
        this.setState({
            upgrading: true
        })
    }

    get currentEtherBalance() {
        return parseFloat(this.state.ethBalance)
    }

    get disableUpgradeButton() {
        return  (this.currentEtherBalance === 0 || 
                 !!this.state.status || 
                 this.state.v1TokenBalance === TOKEN_BALANCE_LOADING || 
                 this.state.v2TokenBalance === TOKEN_BALANCE_LOADING)
    }

    render() {
        return (
            <Dialog
                disableBackdropClick={true}
                disableEscapeKeyDown={true}
                open={this.state.open}
                onClose={() => {
                    this.setState({
                        loading: false,
                        status: null
                    })
                    this.props.onClose()
                }}
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
                        currentEtherBalance={this.currentEtherBalance}
                        currentV1TokenBalance={this.state.v1TokenBalance}
                        currentV2TokenBalance={this.state.v2TokenBalance}
                        timeElapsed={this.state.timeElapsed}
                        status={this.state.status} gasCost={this.state.swapGasCost}
                    />
                    <DialogActions>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                this.setState({
                                    loading: false,
                                    status: null
                                })
                                this.props.onClose()
                            }}
                        >
                            Hide
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={this.disableUpgradeButton}
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
