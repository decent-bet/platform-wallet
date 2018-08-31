import React, { Component, Fragment } from 'react'
import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    Button,
    TextField,
    DialogTitle
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const web3utils = require('web3-utils')

class VETTransferConfirmationDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: props.open,
            address: '',
            amount: props.amount,
            vetBalance: props.vetBalance,
            energyPrice: props.energyPrice,
            errors: {
                address: false,
                energyPrice: false
            }
        }
    }

    static getDerivedStateFromProps(props, state) {
        let newState = {
            open: props.open,
            amount: props.amount,
            vetBalance: props.vetBalance,
            energyPrice: props.energyPrice
        }
        if (props.open) {
            newState.address = state.address || ''
            return newState
        }

        return null
    }

    getEnergyCost = () => {
        return this.state.energyPrice == null
            ? this.renderTinyLoader()
            : this.state.energyPrice
    }

    getVETBalance = () => {
        return this.state.vetBalance == null
            ? this.renderTinyLoader()
            : this.state.vetBalance
    }

    isValidPositiveNumber = n => {
        return n.toString().length > 0 && n > 0
    }

    onReceiverAddressChangedListener = (event, value) => {
        this.setState({ address: value })
    }

    onSendListener = () => {
        let errors = this.state.errors

        errors.address = !web3utils.isAddress(this.state.address)
        errors.energyPrice =
            parseInt(this.state.energyPrice, 10) === 0 ||
            this.state.energyPrice.length === 0

        if (!errors.address && !errors.energyPrice) {
            this.props.onConfirmTransaction(
                this.state.address,
                this.state.amount,
                this.state.energyPrice
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
        let errorsOnEnergyPrice
        if (this.state.errors.energyPrice) {
            errorsOnEnergyPrice = 'Invalid energy price'
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
                        floatingLabelText="Energy Price (VTHO)"
                        value={this.state.energyPrice}
                        onChange={this.onEnergyPriceChangedListener}
                        errorText={errorsOnEnergyPrice}
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
                    Please make sure you have enough VET to cover energy costs
                    for the token transfer. Enter a energy price in VTHO to send
                    the transaction.
                </p>
                <p className="text-info">
                    <small>Energy cost: {this.getEnergyCost()} VTHO</small>
                    <br />
                    <small>VET balance: {this.getVETBalance()} VET</small>
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

export default VETTransferConfirmationDialog
