import React, { Component } from 'react'
import { Dialog, FlatButton, TextField, RaisedButton } from 'material-ui'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

/**
 * Dialog to verify whether the user has saved the mnemonic in a safe place
 */
class NextDialog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            error: false,
            inputMnemonic: '',
            password: '',
            confirmPassword: ''
        }
    }

    isValidCredentials = () => {
        return (
            this.props.mnemonic === this.state.inputMnemonic &&
            this.state.password.length >= 8 &&
            this.state.password === this.state.confirmPassword
        )
    }
    toggleDialog = enabled => {
        this.props.toggleDialog(enabled)
    }
    nextWithKeyPress = ev => {
        if (ev.key === 'Enter') {
            ev.preventDefault()
            if (this.isValidCredentials()) {
                this.props.onNext(this.state.password)
            }
        }
    }

    onNextListener = () => {
        // Double validate
        if (this.isValidCredentials()) {
            this.props.onNext(this.state.password)
        }
    }
    onCloseDialogListener = () => this.toggleDialog(false)

    onMnemonicChangedListener = (event, value) => {
        this.setState({
            inputMnemonic: value,
            error: false
        })
    }

    onPasswordChangedListener = (event, value) => {
        this.setState({ password: value })
    }

    onPasswordConfirmationChangedListener = (event, value) => {
        this.setState({ confirmPassword: value })
    }

    renderDialogActions = () => (
        <div className="card-actions">
            <FlatButton
                label="Back"
                onClick={this.onCloseDialogListener}
                icon={<FontAwesomeIcon icon="arrow-left" />}
            />
            <RaisedButton
                label="Next"
                primary={true}
                disabled={!this.isValidCredentials()}
                onClick={this.onNextListener}
                labelPosition="before"
                icon={<FontAwesomeIcon icon="arrow-right" />}
            />
        </div>
    )

    renderMnemonicInput = () => {
        let errorText
        if (
            this.props.mnemonic !== this.state.inputMnemonic &&
            this.state.inputMnemonic.length > 0
        ) {
            errorText = `Invalid passphrase. Please make sure you've entered the same phrase that was generated.`
        }
        return (
            <TextField
                floatingLabelText="Re-enter passphrase.."
                fullWidth={true}
                value={this.state.inputMnemonic}
                type="text"
                onChange={this.onMnemonicChangedListener}
                onKeyPress={this.nextWithKeyPress}
                errorText={errorText}
            />
        )
    }

    renderPasswordInput = () => {
        let errorText
        if (this.state.password.length < 8 && this.state.password.length > 0) {
            errorText = `Password must be at least 8 characters`
        }

        return (
            <TextField
                type="password"
                fullWidth={true}
                floatingLabelText="Create session password (Minimum 8 chars)"
                value={this.state.password}
                onChange={this.onPasswordChangedListener}
                onKeyPress={this.nextWithKeyPress}
                errorText={errorText}
            />
        )
    }

    renderPasswordConfirmationInput = () => {
        let errorText
        if (
            this.state.confirmPassword.length > 0 &&
            this.state.confirmPassword !== this.state.password
        ) {
            errorText = `Password Confirmation must match the Session Password`
        }

        return (
            <TextField
                type="password"
                fullWidth={true}
                floatingLabelText="Confirm session password"
                value={this.state.confirmPassword}
                onChange={this.onPasswordConfirmationChangedListener}
                onKeyPress={this.nextWithKeyPress}
                errorText={errorText}
            />
        )
    }

    render() {
        return (
            <Dialog
                className="passphrase-confirmation"
                title="Confirm passphrase"
                actions={this.renderDialogActions()}
                modal={false}
                open={this.props.open}
                onRequestClose={this.onCloseDialogListener}
            >
                {this.renderMnemonicInput()}
                <p className="mt-5 mb-0">
                    Your Session Password is required for sending DBETs and
                    exporting your private key, and remains valid until you log
                    out.
                </p>
                {this.renderPasswordInput()}
                {this.renderPasswordConfirmationInput()}
            </Dialog>
        )
    }
}

export default NextDialog
