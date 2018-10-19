import React, { Fragment, Component } from 'react'
import {
    TextField,
    RadioGroup,
    Radio,
    FormControlLabel,
    withStyles,
    Typography
} from '@material-ui/core'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import { LOGIN_MNEMONIC, LOGIN_PRIVATE_KEY } from '../Constants'

const styles = () => ({
    optionItem: {
        marginBottom: '0'
    },
    sessionPasswordRequiredReason: {
        marginTop: '3rem',
        fontSize: '0.85em'
    }
})

class LoginInner extends Component {
    constructor(props) {
        super(props)
    }

    get loginValue() {
        return LOGIN_MNEMONIC.toString() === this.props.loginType ? this.props.nemonic : this.props.privateKey
    }
    
    // Changes the hint text according to the login type
    getHint() {
        switch (parseInt(this.props.loginType)) {
            case LOGIN_MNEMONIC:
                return <FormattedMessage
                            id="src.Components.Login.LoginInner.LoginMnemonicLabel"
                            description="Enter your passphrase"
                        />
            case LOGIN_PRIVATE_KEY:
                return <FormattedMessage
                            id="src.Components.Login.LoginInner.LoginPrivateKeyLabel"
                            description="Enter your private key"
                        />
            default:
                // Should not happen
                return null
        }
    }
    render() {
        return (
            <Fragment>
                <RadioGroup 
                    name="loginType"
                    value={this.props.loginType}
                    onChange={this.props.onLoginTypeChangedListener}
                >
                    <FormControlLabel
                        className={this.props.classes.optionItem}
                        value={LOGIN_MNEMONIC.toString()}
                        control={<Radio />}
                        label={
                            <FormattedMessage
                                id="src.Components.Login.LoginInner.RadioLabelPassphrase"
                                description="Passphrase label"
                            />
                        }
                    />
                    <FormControlLabel
                        className={this.props.classes.optionItem}
                        value={LOGIN_PRIVATE_KEY.toString()}
                        control={<Radio />}
                        label={
                            <FormattedMessage
                                id="src.Components.Login.LoginInner.RadioLabelPrivateKey"
                                description="Private Key label"
                            />
                        }
                    />
                </RadioGroup>
    
                <TextField id="passphraseInput"
                    multiline
                    rowsMax="2"
                    margin="normal"
                    fullWidth={true}
                    label={this.getHint()}
                    value={this.props.loginValue}
                    onChange={this.props.onMnemonicChangedListener}
                    onKeyPress={this.props.onKeyPressListener}
                />
                <Typography className={this.props.classes.sessionPasswordRequiredReason}>
                <FormattedMessage
                        id="src.Components.Login.LoginInner.SessionPasswordRequiredReason"
                        description="Session password required reason"
                    />
                </Typography> 
                <TextField id="passwordInputId"
                    type="password"
                    fullWidth={true}
                    label={
                        <FormattedMessage
                            id="src.Components.Login.LoginInner.CreateSessionPassword"
                            description="Create Session Password Label"
                        />
                    }
                    value={this.props.password}
                    onChange={this.props.onPasswordChangedListener}
                    onKeyPress={this.props.onKeyPressListener}
                />
    
                <TextField id="passwordConfirmationInputId"
                    type="password"
                    fullWidth={true}
                    label={
                        <FormattedMessage
                            id="src.Components.Login.LoginInner.ConfirmSessionPassword"
                            description="Confirm Session Password Label"
                        />
                    }
                    value={this.props.confirmPassword}
                    onChange={this.props.onPasswordConfirmationChangedListener}
                    onKeyPress={this.props.onKeyPressListener}
                />
            </Fragment>
        )
    }
}


LoginInner.propTypes = {
    classes: PropTypes.object.isRequired,
    loginType: PropTypes.string.isRequired,
    mnemonic: PropTypes.string.isRequired,
    privateKey: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
    confirmPassword: PropTypes.string.isRequired,
    onLoginTypeChangedListener: PropTypes.func.isRequired,
    onMnemonicChangedListener: PropTypes.func.isRequired,
    onKeyPressListener: PropTypes.func.isRequired,
    onPasswordChangedListener: PropTypes.func.isRequired,
    onPasswordConfirmationChangedListener: PropTypes.func.isRequired
}

export default withStyles(styles)(LoginInner)
