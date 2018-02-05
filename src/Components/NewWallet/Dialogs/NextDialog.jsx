import React, { Component, Fragment } from 'react'
import { Dialog, FlatButton, TextField, RaisedButton } from 'material-ui'

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

    onNextListener = () => this.props.onNext(this.state.password)
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
        <Fragment>
            <FlatButton label="Back" onClick={this.onCloseDialogListener} />
            <RaisedButton
                label="Next"
                primary={true}
                disabled={!this.isValidCredentials()}
                onClick={this.onNextListener}
            />
        </Fragment>
    )

    renderWrongPassphaseText = () => {
        if (this.state.error) {
            return (
                <p className="text-danger">
                    Invalid passphrase. Please make sure you&#39;ve entered the
                    same phrase that was generated.
                </p>
            )
        } else {
            return <Fragment />
        }
    }

    render() {
        return (
            <Dialog
                title="Confirm passphrase"
                actions={this.renderDialogActions()}
                modal={false}
                open={this.props.open}
                onRequestClose={this.onCloseDialogListener}
            >
                <TextField
                    floatingLabelText="Re-enter passphrase.."
                    fullWidth={true}
                    value={this.state.inputMnemonic}
                    type="text"
                    onChange={this.onMnemonicChangedListener}
                    onKeyPress={this.nextWithKeyPress}
                />

                {this.renderWrongPassphaseText()}

                <TextField
                    type="password"
                    fullWidth={true}
                    floatingLabelText="Create temporary password (Minimum 8 chars)"
                    value={this.state.password}
                    onChange={this.onPasswordChangedListener}
                    onKeyPress={this.nextWithKeyPress}
                />
                <TextField
                    type="password"
                    fullWidth={true}
                    floatingLabelText="Confirm temporary password"
                    value={this.state.confirmPassword}
                    onChange={this.onPasswordConfirmationChangedListener}
                    onKeyPress={this.nextWithKeyPress}
                />
                <p>
                    Password will be needed to send DBETs or export private key
                    and will remain active till log out.
                </p>
            </Dialog>
        )
    }
}

export default NextDialog
