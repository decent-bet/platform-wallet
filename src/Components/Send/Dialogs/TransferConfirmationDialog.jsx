import React, { Component, Fragment } from 'react'
import {BigNumber} from 'bignumber.js'
import {
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    TextField,
    Slide,
    Typography
} from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import Helper from '../../Helper'

const helper = new Helper()
const web3utils = require('web3-utils')

const constants = require('../../Constants')


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
            },
            isSending: false,
            userUpdated: false
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
            if(state.userUpdated === true) {
                newState.gasPrice = state.gasPrice  || ''
            } else {
                newState.gasPrice = constants.DEFAULT_GAS_PRICE
            }
            return newState
        }

        return null
    }

    getGasCostMessage = () => {
        let gasPrice = parseInt(this.state.gasPrice, 10)
        if (this.isValidPositiveNumber(gasPrice)) {
            return `${this.weiToEther(this.getGasCost())} ETH`
        } else {
             return 'Please enter a valid gas price'
        }
    }

    getGasCost = () => {
        let gasPrice = parseInt(this.state.gasPrice, 10)
        let gasLimit = 60000
        let gwei = web3utils.toWei('1', 'gwei')
        return new BigNumber(gasLimit * gasPrice * gwei).toFixed()
    }

    weiToEther = wei => web3utils.fromWei(wei,'ether')

    getEthBalance = () => {
        return this.state.ethBalance == null
            ? this.renderTinyLoader()
            : this.state.ethBalance
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

    onGasPriceChangedListener = (event) => {
        this.setState({userUpdated: true, gasPrice: event.target.value })
    }

    onOpenGasStationListener = () =>
        helper.openUrl('http://ethgasstation.info/')

    getErrors() {
        let errors = this.state.errors

        errors.address = !web3utils.isAddress(this.state.address)
        errors.gasPrice =
            parseInt(this.state.gasPrice, 10) === 0 ||
            this.state.gasPrice.length === 0
        return errors
    }

    resetState = () =>{
        this.setState({
            address: '',
            errors: {
                address: false,
                gasPrice: false
            },
            isSending: false,
            userUpdated: false
        })
    }

    onClose = () => {
        this.resetState()
        this.props.onClose()
    }

    onSendListener = () => {
        let errors = this.getErrors()

        if (!errors.address && !errors.gasPrice) {
            this.setState({isSending: true })
            this.props.onConfirmTransaction(
                this.state.address,
                this.state.amount,
                this.state.gasPrice
            )
        }

        this.setState({ errors: errors })
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
        let errorsOnGasPrice = null
        if (this.state.errors.gasPrice) {
            errorsOnGasPrice = 'Invalid gas price'
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
                        helperText={errorsOnGasPrice}
                        error={errorsOnGasPrice !== null}
                    />
                </div>
                <div className="col-12 col-md-6">
                    <TextField
                        disabled={this.state.isSending}
                        type="number"
                        fullWidth
                        label="Gas Price (GWei)"
                        value={this.state.gasPrice}
                        onChange={this.onGasPriceChangedListener}
                        helperText={errorsOnGasPrice}
                        error={errorsOnGasPrice !== null}
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
                </Typography>
                <Typography component="div" className="text-info">
                    <small>Gas cost: {this.getGasCostMessage()}</small>
                    <br/>
                    <small>ETH balance: {this.getEthBalance()} ETH</small>
                    <br/>
                    {!this.isETHAvailableForGasCosts() ?
                        <p className="text-danger font-weight-bold">
                            (You need atleast {this.weiToEther(this.getGasCost())} ETH to transfer DBETs)
                        </p> :
                        ''
                    }
                </Typography>
            </Fragment>
        )
    }

    renderTinyLoader = () => {
        return <CircularProgress size={18} />
    }

    isETHAvailableForGasCosts = () => this.state.ethBalance > this.weiToEther(this.getGasCost())

    render() {
        return (
            <Dialog
                    TransitionComponent={Transition}
                    open={this.props.open}
                    onClose={this.onClose}
                >
                    <DialogTitle>Confirmation - Send DBETs</DialogTitle>
                    <DialogContent>{this.renderDialogInner()}</DialogContent>
                    <DialogActions>
                    <DialogActions className={this.props.classes.actions}>
                            <Button
                                disabled={this.state.isSending}
                                onClick={this.onClose}
                                className={this.props.classes.button}
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={
                                    this.state.errors.gasPrice ||
                                    this.state.errors.address ||
                                    this.state.isSending ||
                                    !this.isETHAvailableForGasCosts()
                                }
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
                    </DialogActions>
                </Dialog>
        )
    }
}

TransferConfirmationDialog.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(TransferConfirmationDialog)

