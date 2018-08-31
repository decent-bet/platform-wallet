import React, { Component, Fragment } from 'react'
import {BigNumber} from 'bignumber.js'
import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Helper from '../../Helper'

const helper = new Helper()
const web3utils = require('web3-utils')

const constants = require('../../Constants')


const styles = theme => ({
    root: {
        backgroundColor: theme.palette.common.white,
    },
    actions: {
        display: 'flex',
        flexDirection: 'column'
    },
    button: {
        margin: theme.spacing.unit
    },
    extendedIcon: {
        marginRight: theme.spacing.unit
    }
})

class TransferConfirmationDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: props.open,
            address: '',
            amount: props.amount,
            ethBalance: props.ethBalance,
            vetBalance: props.vetBalance,
            gasPrice: constants.DEFAULT_GAS_PRICE,
            errors: {
                address: false,
                gasPrice: false
            }
        }
    }

    static getDerivedStateFromProps(props, state) {
        let newState = {
            open: props.open,
            amount: props.amount,
            ethBalance: props.ethBalance,
            gasPrice: constants.DEFAULT_GAS_PRICE,
        }

        if (props.open) {
            newState.address = state.address ||  ''
            return newState
        }

        return null
    }


    getGasCost = () => {
        let gasPrice = parseInt(this.state.gasPrice, 10)
        let gasLimit = 60000
        if (this.isValidPositiveNumber(gasPrice)) {
            let gwei = web3utils.toWei('1', 'gwei')            
            // const n = new web3utils.BN(gasLimit)
            // n.mul(gasPrice).mul(gwei)
            const cost = new BigNumber(gasLimit * gasPrice * gwei)            
            const n = cost.toFixed()
            return  `${web3utils.fromWei(n.toString(),'ether')} ETH`
        } else {
             return 'Please enter a valid gas price'
        }
    }

    getEthBalance = () => {
        return this.state.ethBalance == null
            ? this.renderTinyLoader()
            : this.state.ethBalance
    }

    isValidPositiveNumber = n => {
        return n.toString().length > 0 && n > 0
    }

    onReceiverAddressChangedListener = (event, value) => {
        this.setState({ address: value })
    }

    onGasPriceChangedListener = (event, value) => {
        this.setState({ gasPrice: value })
    }

    onOpenGasStationListener = () =>
        helper.openUrl('http://ethgasstation.info/')

    onSendListener = () => {
        let errors = this.state.errors

        errors.address = !web3utils.isAddress(this.state.address)
        errors.gasPrice =
            parseInt(this.state.gasPrice, 10) === 0 ||
            this.state.gasPrice.length === 0

        if (!errors.address && !errors.gasPrice) {
            this.props.onConfirmTransaction(
                this.state.address,
                this.state.amount,
                this.state.gasPrice
            )
        }

        this.setState({ errors: errors })
    }

    renderDialogActions = () => (
        <Button variant="contained"
            onClick={this.onSendListener}
        >
        <FontAwesomeIcon icon="paper-plane" />
        Send DBETs
        </Button>
    )

    renderAddressField = () => {
        let errorText
        if (this.state.errors.address) {
            errorText = 'Invalid address'
        }
        return (
            <div className="col-12">
                <TextField
                    type="text"
                    fullWidth={true}
                    floatingLabelText="Receiver Address"
                    value={this.state.address}
                    onChange={this.onReceiverAddressChangedListener}
                    errorText={errorText}
                />
            </div>
        )
    }

    renderValuesFields = () => {
        let errorsOnGasPrice
        if (this.state.errors.gasPrice) {
            errorsOnGasPrice = 'Invalid gas price'
        }
        return (
            <Fragment>
                <div className="col-12 col-md-6">
                    <TextField
                        type="number"
                        fullWidth={true}
                        floatingLabelText="Amount of DBETs"
                        value={this.state.amount}
                    />
                </div>
                <div className="col-12 col-md-6">
                    <TextField
                        type="number"
                        fullWidth={true}
                        floatingLabelText="Gas Price (GWei)"
                        value={this.state.gasPrice}
                        onChange={this.onGasPriceChangedListener}
                        errorText={errorsOnGasPrice}
                    />
                </div>
            </Fragment>
        )
    }

    renderDialogInner = () => {
        return (
            <Fragment>
                <div className="row">
                    {this.renderAddressField()}
                    {this.renderValuesFields()}
                </div>
                <p>
                    Please make sure you have enough ETH to cover gas costs for
                    the token transfer. Enter a gas price in gwei to send the
                    transaction. 20 gwei is recommended for quick and economic
                    transactions. For up-to-date information on current gas
                    prices, please visit
                    <a
                        className="dbet-link"
                        onClick={this.onOpenGasStationListener}
                    >
                        {' '}
                        ETH Gas station
                    </a>
                </p>
                <p className="text-info">
                    <small>Gas cost: {this.getGasCost()}</small>
                    <br />
                    <small>ETH balance: {this.getEthBalance()} ETH</small>
                </p>
            </Fragment>
        )
    }

    renderTinyLoader = () => {
        return <CircularProgress size={18} />
    }

    render() {
        return (
            <Dialog
                    className="transfer-confirmation-dialog"
                    scroll={'body'}
                    open={this.state.open}
                    onClose={this.props.onClose}
                >
                    <DialogTitle>Confirmation - Send DBETs</DialogTitle>
                    <DialogContent>{this.renderDialogInner()}</DialogContent>
                    <DialogActions>{this.renderDialogActions()}</DialogActions>
                </Dialog>
        )
    }
}

TransferConfirmationDialog.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(TransferConfirmationDialog)

