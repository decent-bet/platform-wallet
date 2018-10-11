import React, { Component } from 'react'
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Slide,
    TextField,
    Button,
    Typography
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'

function Transition(props) {
    return <Slide direction="left" {...props} />
}

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

const messages = defineMessages({
    Next: {
        id: 'common.Next'
    },
    Back: {
        id: 'common.Back'
    },
    ConfirmPassphrase: {
        id: 'src.Components.NewWallet.Dialogs.NextDialog.ConfirmPassphrase'
    },
    SessionPasswordRequiredReason: {
        id: 'src.Components.NewWallet.Dialogs.NextDialog.SessionPasswordRequiredReason'
    },
    InvalidPassphrase: {
        id: 'src.Components.NewWallet.Dialogs.NextDialog.InvalidPassphrase'
    },
    ReEnterPassphrase: {
        id: 'src.Components.NewWallet.Dialogs.NextDialog.ReEnterPassphrase'
    },
    CreateSessionPassword: {
        id: 'src.Components.NewWallet.Dialogs.NextDialog.CreateSessionPassword'
    },
    ConfirmSessionPassword: {
        id: 'src.Components.NewWallet.Dialogs.NextDialog.ConfirmSessionPassword'
    },
    PasswordLength: {
        id: 'src.Components.NewWallet.Dialogs.NextDialog.PasswordLength'
    },
    PasswordConfirmationMustMatch: {
        id:
            'src.Components.NewWallet.Dialogs.NextDialog.PasswordConfirmationMustMatch'
    },
    ConfirmSessionPasswor: {
        id: 'src.Components.NewWallet.Dialogs.NextDialog.ConfirmSessionPasswor'
    }
})
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

    onMnemonicChangedListener = event => {
        this.setState({
            inputMnemonic: event.target.value,
            error: false
        })
    }

    onPasswordChangedListener = event => {
        this.setState({ password: event.target.value })
    }

    onPasswordConfirmationChangedListener = event => {
        this.setState({ confirmPassword: event.target.value })
    }

    renderMnemonicInput = () => {
        let errorText = null
        if (
            this.props.mnemonic !== this.state.inputMnemonic &&
            this.state.inputMnemonic.length > 0
        ) {
            errorText = <FormattedMessage {...messages.InvalidPassphrase} />
        }

        return (
            <TextField
                label={<FormattedMessage {...messages.ReEnterPassphrase} />}
                fullWidth={true}
                value={this.state.inputMnemonic}
                multiline
                rows="2"
                maxRows="2"
                onChange={this.onMnemonicChangedListener}
                onKeyPress={this.nextWithKeyPress}
                error={errorText !== null}
                helperText={errorText ? errorText : ''}
            />
        )
    }

    renderPasswordInput = () => {
        let errorText = null
        if (this.state.password.length < 8 && this.state.password.length > 0) {
            errorText = <FormattedMessage {...messages.PasswordLength} />
        }

        return (
            <TextField
                type="password"
                fullWidth={true}
                label={<FormattedMessage {...messages.CreateSessionPassword} />}
                value={this.state.password}
                onChange={this.onPasswordChangedListener}
                onKeyPress={this.nextWithKeyPress}
                error={errorText !== null}
                helperText={errorText ? errorText : ''}
            />
        )
    }

    renderPasswordConfirmationInput = () => {
        let errorText = null
        if (
            this.state.confirmPassword.length > 0 &&
            this.state.confirmPassword !== this.state.password
        ) {
            errorText = (
                <FormattedMessage {...messages.PasswordConfirmationMustMatch} />
            )
        }

        return (
            <TextField
                type="password"
                fullWidth={true}
                label={
                    <FormattedMessage {...messages.ConfirmSessionPassword} />
                }
                value={this.state.confirmPassword}
                onChange={this.onPasswordConfirmationChangedListener}
                onKeyPress={this.nextWithKeyPress}
                error={errorText !== null}
                helperText={errorText ? errorText : ''}
            />
        )
    }

    render() {
        return (
            <Dialog
                open={this.props.open}
                TransitionComponent={Transition}
                onClose={this.onCloseDialogListener}
            >
                <DialogTitle>
                    <span>
                        <FormattedMessage {...messages.ConfirmPassphrase} />
                    </span>
                </DialogTitle>
                <DialogContent>
                    {this.renderMnemonicInput()}
                    <DialogContentText>
                        <Typography className="mt-5 mb-0">
                            <FormattedMessage
                                {...messages.SessionPasswordRequiredReason}
                            />
                        </Typography>
                    </DialogContentText>
                    {this.renderPasswordInput()}
                    {this.renderPasswordConfirmationInput()}
                </DialogContent>
                <DialogActions className={this.props.classes.actions}>
                    <Button
                        onClick={this.onCloseDialogListener}
                        className={this.props.classes.button}
                    >
                        <FontAwesomeIcon
                            icon="arrow-left"
                            className={this.props.classes.extendedIcon}
                        />

                        <FormattedMessage {...messages.Back} />
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={this.onNextListener}
                        className={this.props.classes.button}
                    >
                        <FormattedMessage {...messages.Next} />
                        <FontAwesomeIcon
                            icon="arrow-right"
                            className={this.props.classes.extendedIcon}
                        />
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

NextDialog.propTypes = {
    classes: PropTypes.object.isRequired
}
export default withStyles(styles)(injectIntl(NextDialog))
