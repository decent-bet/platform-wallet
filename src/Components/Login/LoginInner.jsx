import React, { Fragment } from 'react'
import { TextField, RadioGroup, Radio } from '@material-ui/core'
import { FormattedMessage } from 'react-intl'

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
    privateKey,
    password,
    confirmPassword,
    onLoginTypeChangedListener,
    onMnemonicChangedListener,
    onKeyPressedListener,
    onPasswordChangedListener,
    onPasswordConfirmationChangedListener
}) {
    let loginValue =
        loginType === constants.LOGIN_MNEMONIC ? mnemonic : privateKey
    return (
        <Fragment>
            <RadioGroup
                name="loginType"
                valueSelected={loginType}
                onChange={onLoginTypeChangedListener}
            >
                <Radio
                    value={constants.LOGIN_MNEMONIC}
                    label="Passphrase"
                />
                <Radio
                    value={constants.LOGIN_PRIVATE_KEY}
                    label="Private key"
                />
            </RadioGroup>

            <TextField
                type="text"
                fullWidth={true}
                multiLine={true}
                floatingLabelText={getHint(loginType)}
                value={loginValue}
                onChange={onMnemonicChangedListener}
                onKeyPress={onKeyPressedListener}
            />

            <p className="mt-5">
                <FormattedMessage
                    id="src.Components.Login.LoginInner.SessionPasswordRequiredReason"
                    description="Session password required reason"
                />
            </p>

            <TextField
                type="password"
                fullWidth={true}
                floatingLabelText="New Session Password"
                value={password}
                onChange={onPasswordChangedListener}
                onKeyPress={onKeyPressedListener}
            />
            <TextField
                type="password"
                fullWidth={true}
                floatingLabelText="Confirm Session Password"
                value={confirmPassword}
                onChange={onPasswordConfirmationChangedListener}
                onKeyPress={onKeyPressedListener}
            />
        </Fragment>
    )
}
