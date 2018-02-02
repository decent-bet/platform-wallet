import React from 'react'
import { TextField } from 'material-ui'

const styles = require('../Base/styles').styles
const constants = require('../Constants')

export default class LoginInner extends React.Component {
    getHint = () => {
        switch (this.props.loginType) {
            case constants.LOGIN_MNEMONIC:
                return 'Enter your passphrase'
            case constants.LOGIN_PRIVATE_KEY:
                return 'Enter your private key'
            default:
                // Should not happen
                return ''
        }
    }

    render() {
        let loginValue =
            this.props.loginType === constants.LOGIN_MNEMONIC
                ? this.props.mnemonic
                : this.props.key

        return (
            <div className="row">
                <div className="col-12 mt-4">
                    <TextField
                        type="text"
                        fullWidth={true}
                        multiLine={true}
                        hintText={this.getHint()}
                        hintStyle={styles.textField.hintStyle}
                        inputStyle={styles.textField.inputStyle}
                        floatingLabelStyle={styles.textField.floatingLabelStyle}
                        floatingLabelFocusStyle={
                            styles.textField.floatingLabelFocusStyle
                        }
                        underlineStyle={styles.textField.underlineStyle}
                        underlineFocusStyle={styles.textField.underlineStyle}
                        value={loginValue}
                        onChange={this.props.onMnemonicChangedListener}
                        onKeyPress={this.props.onKeyPressedListener}
                    />
                </div>
                <div className="col-12 mt-4">
                    <TextField
                        type="password"
                        fullWidth={true}
                        inputStyle={styles.textField.inputStyle}
                        hintText="Create password (Minimum 8 chars)"
                        hintStyle={styles.textField.hintStyle}
                        floatingLabelStyle={styles.textField.floatingLabelStyle}
                        floatingLabelFocusStyle={
                            styles.textField.floatingLabelFocusStyle
                        }
                        underlineStyle={styles.textField.underlineStyle}
                        underlineFocusStyle={styles.textField.underlineStyle}
                        value={this.props.password}
                        onChange={this.onPasswordChangedListener}
                        onKeyPress={this.onKeyPressedListener}
                    />
                </div>
                <div className="col-12 mt-4">
                    <TextField
                        type="password"
                        fullWidth={true}
                        inputStyle={styles.textField.inputStyle}
                        hintText="Confirm Password"
                        hintStyle={styles.textField.hintStyle}
                        floatingLabelStyle={styles.textField.floatingLabelStyle}
                        floatingLabelFocusStyle={
                            styles.textField.floatingLabelFocusStyle
                        }
                        underlineStyle={styles.textField.underlineStyle}
                        underlineFocusStyle={styles.textField.underlineStyle}
                        value={this.props.confirmPassword}
                        onChange={this.onPasswordConfirmationChangedListener}
                        onKeyPress={this.onKeyPressedListener}
                    />
                </div>
                <div className="col-12 my-2">
                    <p>
                        Password will be needed to send DBETs or export private
                        key and will remain active until log out.
                    </p>
                </div>
            </div>
        )
    }
}
