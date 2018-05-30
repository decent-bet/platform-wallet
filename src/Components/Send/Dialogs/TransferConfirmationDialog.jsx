import React, { Component, Fragment } from 'react'

import {
    CircularProgress,
    Dialog,
    RaisedButton,
    MuiThemeProvider,
    TextField
} from 'material-ui'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import Helper from '../../Helper'
import Themes from '../../Base/Themes'

const helper = new Helper()
const themes = new Themes()

const constants = require('../../Constants')

class TransferConfirmationDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            open: props.open,
            address: '',
            amount: props.amount,
            ethBalance: props.ethBalance,
            gasPrice: constants.DEFAULT_GAS_PRICE,
            errors: {
                address: false,
                gasPrice: false
            }
        }
    }

    componentWillReceiveProps = props => {
        let newState = {
            open: props.open,
            amount: props.amount,
            ethBalance: props.ethBalance
        }
        if (props.open) {
            newState.address = ''
            newState.gasPrice = constants.DEFAULT_GAS_PRICE
        }
        this.setState(newState)
    }

    getGasCost = () => {
        let gasPrice = parseInt(this.state.gasPrice, 10)
        let gasLimit = 60000
        if (this.isValidPositiveNumber(gasPrice)) {
            let gwei = helper.getMainnetWeb3().toWei('1', 'gwei')
            return (
                helper.getMainnetWeb3()
                .fromWei(
                        helper.getMainnetWeb3()
                        .toBigNumber(gasLimit)
                        .times(gasPrice)
                        .times(gwei),
                    'ether'
                )
                .toFixed() + ' ETH'
            )
        } else return 'Please enter a valid gas price'
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

        errors.address = !helper.getMainnetWeb3().isAddress(this.state.address)
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
        <RaisedButton
            label="Send DBETs"
            primary={true}
            onTouchTap={this.onSendListener}
            icon={<FontAwesomeIcon icon="paper-plane" />}
        />
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
            <MuiThemeProvider muiTheme={themes.getMainTheme()}>
                <Dialog
                    title="Confirmation - Send DBETs"
                    className="transfer-confirmation-dialog"
                    actions={this.renderDialogActions()}
                    autoScrollBodyContent={true}
                    modal={false}
                    open={this.state.open}
                    onRequestClose={this.props.onClose}
                >
                    {this.renderDialogInner()}
                </Dialog>
            </MuiThemeProvider>
        )
    }
}

export default TransferConfirmationDialog
