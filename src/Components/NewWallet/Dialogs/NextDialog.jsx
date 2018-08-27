import React, { Component } from 'react'
import { Dialog, Button, TextField } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { injectIntl } from 'react-intl'
import { getI18nFn, componentMessages } from '../../../i18n/componentMessages'
let i18n
const messages = componentMessages(
    'src.Components.NewWallet.Dialogs.NextDialog',
    [
        { Next: 'common.Next' },
        { Back: 'common.Back' },
        'ConfirmPassphrase',
        'SessionPasswordRequiredReason',
        'InvalidPassphrase',
        'ReEnterPassphrase',
        'CreateSessionPassword',
        'ConfirmSessionPassword',
        'PasswordLength',
        'PasswordConfirmationMustMatch',
        'CreateSessionPassword',
        'ConfirmSessionPassword'
    ]
)
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
        i18n = getI18nFn(this.props.intl, messages)
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
            <Button
                label={i18n('Back')}
                onClick={this.onCloseDialogListener}
                icon={<FontAwesomeIcon icon="arrow-left" />}
            />
            <Button variant="contained"
                label={i18n('Next')}
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
            errorText = i18n('InvalidPassphrase')
        }

        return (
            <TextField
                floatingLabelText={i18n('ReEnterPassphrase')}
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
            errorText = i18n('PasswordLength')
        }

        return (
            <TextField
                type="password"
                fullWidth={true}
                floatingLabelText={i18n('CreateSessionPassword')}
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
            errorText = i18n('PasswordConfirmationMustMatch')
        }

        return (
            <TextField
                type="password"
                fullWidth={true}
                floatingLabelText={i18n('ConfirmSessionPassword')}
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
                title={i18n('ConfirmPassphrase')}
                actions={this.renderDialogActions()}
                modal={false}
                open={this.props.open}
                onRequestClose={this.onCloseDialogListener}
            >
                {this.renderMnemonicInput()}
                <p className="mt-5 mb-0">
                    {i18n('SessionPasswordRequiredReason')}
                </p>
                {this.renderPasswordInput()}
                {this.renderPasswordConfirmationInput()}
            </Dialog>
        )
    }
}

export default injectIntl(NextDialog)
