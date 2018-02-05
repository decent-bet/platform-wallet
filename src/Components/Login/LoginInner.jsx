import React, { Fragment } from 'react'
import { TextField, RadioButtonGroup, RadioButton } from 'material-ui'

const constants = require('../Constants')

// Changes the hint text according to the login type
function getHint(loginType) {
    switch (loginType) {
        case constants.LOGIN_MNEMONIC:
            return 'Enter your passphrase'
        case constants.LOGIN_PRIVATE_KEY:
            return 'Enter your private key'
        default:
            // Should not happen
            return ''
    }
}

export default function LoginInner({
    loginType,
    mnemonic,
    key,
    password,
    confirmPassword,
    onLoginTypeChangedListener,
    onMnemonicChangedListener,
    onKeyPressedListener,
    onPasswordChangedListener,
    onPasswordConfirmationChangedListener
}) {
    let loginValue = loginType === constants.LOGIN_MNEMONIC ? mnemonic : key
    return (
        <Fragment>
            <RadioButtonGroup
                name="loginType"
                valueSelected={loginType}
                onChange={onLoginTypeChangedListener}
            >
                <RadioButton
                    value={constants.LOGIN_MNEMONIC}
                    label="Passphrase"
                />
                <RadioButton
                    value={constants.LOGIN_PRIVATE_KEY}
                    label="Private key"
                />
            </RadioButtonGroup>

            <TextField
                type="text"
                fullWidth={true}
                multiLine={true}
                floatingLabelText={getHint(loginType)}
                value={loginValue}
                onChange={onMnemonicChangedListener}
                onKeyPress={onKeyPressedListener}
            />

            <p>
                Your session password is required for sending DBET tokens and
                exporting your private key, and remains valid until you log out
            </p>

            <TextField
                type="password"
                fullWidth={true}
                floatingLabelText="New Password"
                value={password}
                onChange={onPasswordChangedListener}
                onKeyPress={onKeyPressedListener}
            />
            <TextField
                type="password"
                fullWidth={true}
                floatingLabelText="Confirm New Password"
                value={confirmPassword}
                onChange={onPasswordConfirmationChangedListener}
                onKeyPress={onKeyPressedListener}
            />
        </Fragment>
    )
}
