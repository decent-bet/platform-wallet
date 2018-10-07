import React, { Component, Fragment } from 'react'
import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    Button,
    TextField,
    DialogTitle,
    Slide,
    Typography
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

const web3utils = require('web3-utils')

const styles = theme => ({
    actions: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    button: {
        margin: theme.spacing.unit
    },
    extendedIcon: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit
    }
})

function Transition(props) {
    return <Slide direction="down" {...props} />
}

class VETTransferConfirmationDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: props.open,
            address: '',
            amount: props.amount,
            vthoBalance: props.vthoBalance,
            energyPrice: props.energyPrice,
            errors: {
                address: false,
                energyPrice: false
            },
            isSending: false,
            userUpdated: false
        }
    }

    static getDerivedStateFromProps(props, state) {
        let newState = {
            open: props.open,
            amount: props.amount,
            vthoBalance: props.vthoBalance,
            energyPrice: props.energyPrice
        }

        if (props.open) {
            newState.address = state.address || ''
            if(state.userUpdated === true) {
                newState.energyPrice = state.energyPrice  || ''
            }
            
            return newState
        }

        return null
    }

    getEnergyCost = () => {
        return this.state.energyPrice == null || this.state.energyPrice === ''
            ? this.renderTinyLoader()
            : this.state.energyPrice
    }

    getVTHO = () => {
        return this.state.vthoBalance == null
            ? this.renderTinyLoader()
            : this.state.vthoBalance
    }

    isValidPositiveNumber = n => {
        return n.toString().length > 0 && n > 0
    }

    onReceiverAddressChangedListener = (event) => {
        if (event.target.value.length === 0) {
            const errors = {
                address: null,
            }
            this.setState({ errors })
        }
        this.setState({ address: event.target.value })
    }

    getErrors() {
        let errors = this.state.errors

        errors.address = !web3utils.isAddress(this.state.address)
        errors.energyPrice = !this.state.energyPrice || parseInt(this.state.energyPrice, 10) === 0 ||
            this.state.energyPrice.length === 0
        return errors
    }

    onEnergyPriceChangedListener = (event) => {
        this.setState({ userUpdated: true, energyPrice: event.target.value })
    }

    onSendListener = () => {
        let errors = this.getErrors()

        if (!errors.address && !errors.energyPrice) {
            this.setState({isSending: true })
            this.props.onConfirmTransaction(
                this.state.address,
                this.state.amount,
                this.state.energyPrice
            )
        }

        this.setState({ errors: errors })
    }

    onClose = () => {
        const errors = {
            address: null,
        }
        this.setState({ address: '', errors, isSending: false })
        this.props.onClose()
    }

    renderAddressField = () => {
        let errorText = null
        if (this.state.errors.address) {
            errorText = 'Invalid address'
        }
        return (
            <div className="col-12">
                <TextField
                    disabled={this.state.isSending}
                    type="text"
                    fullWidth
                    label="Receiver Address"
                    value={this.state.address}
                    onChange={this.onReceiverAddressChangedListener}
                    helperText={errorText}
                    error={errorText !== null}
                />
            </div>
        )
    }

    renderValuesFields = () => {
        let errorsOnEnergyPrice = null
        if (this.state.errors.energyPrice) {
            errorsOnEnergyPrice = 'Invalid energy price'
        }
        return (
            <Fragment>
                <div className="col-12 col-md-6">
                    <TextField
                        disabled={this.state.isSending}
                        type="number"
                        fullWidth
                        label="Amount of DBETs"
                        value={this.state.amount}
                        helperText={errorsOnEnergyPrice}
                        error={errorsOnEnergyPrice !== null}
                    />
                </div>
                <div className="col-12 col-md-6">
                    <TextField
                        disabled={this.state.isSending}
                        type="number"
                        fullWidth
                        label="Energy Price (VTHO)"
                        value={this.state.energyPrice}
                        onChange={this.onEnergyPriceChangedListener}
                        helperText={errorsOnEnergyPrice}
                        error={errorsOnEnergyPrice !== null}
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
                <Typography>
                    Please make sure you have enough VET to cover energy costs
                    for the token transfer. Enter a energy price in VTHO to send
                    the transaction.
                </Typography>
                <Typography component="div" className="text-info">
                    <small>Energy cost: {this.getEnergyCost()} VTHO</small>
                    <br />
                    <small>VTHO balance: {this.getVTHO()} VTHO</small>
                </Typography>
            </Fragment>
        )
    }

    renderTinyLoader = () => {
        return <CircularProgress size={18} />
    }

    render() {
        return (
            <Dialog
                open={this.props.open}
                onClose={this.props.onClose}
                TransitionComponent={Transition}
            >
                <DialogTitle>Confirmation - Send DBETs</DialogTitle>
                <DialogContent>{this.renderDialogInner()}</DialogContent>
                <DialogActions className={this.props.classes.actions}>
                    <Button
                        disabled={this.state.isSending}
                        onClick={this.onClose}
                        className={this.props.classes.button}
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={this.state.errors.energyPrice || this.state.errors.address || this.state.isSending}
                        variant="contained"
                        color="primary"
                        className={this.props.classes.button}
                        onClick={this.onSendListener}
                    >
                        <FontAwesomeIcon
                            icon="paper-plane"
                            className={this.props.classes.extendedIcon}
                        />
                        Send DBETs
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

VETTransferConfirmationDialog.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(VETTransferConfirmationDialog)
