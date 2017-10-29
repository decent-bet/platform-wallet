import React, {Component} from 'react'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'

import Themes from './../../Base/Themes'
const themes = new Themes()

const dialogStyles = require('./../../Base/DialogStyles').styles
const styles = require('./../../Base/styles').styles

/**
 * Dialog to verify whether the user has saved the mnemonic in a safe place
 */
class NextDialog extends Component {

    constructor(props) {
        super(props)
        this.state = {
            open: false,
            error: false,
            mnemonic: props.mnemonic,
            inputMnemonic: '',
            password: '',
            confirmPassword: ''
        }
    }

    componentWillReceiveProps = (props) => {
        this.setState({
            open: props.open,
            mnemonic: props.mnemonic,
            error: false,
            inputMnemonic: '',
            password: '',
            confirmPassword: ''
        })
    }

    helpers = () => {
        const self = this
        return {
            isValidCredentials: () => {
                return ((self.state.mnemonic == self.state.inputMnemonic) &&
                self.state.password.length >= 8 &&
                self.state.password == self.state.confirmPassword)
            },
            toggleDialog: (enabled) => {
                this.props.toggleDialog(enabled)
            },
            nextWithKeyPress: (ev) => {
                if (ev.key === 'Enter') {
                    ev.preventDefault()
                    if (self.helpers().isValidCredentials())
                        self.props.onNext(self.state.password)
                }
            }
        }
    }

    render() {
        const self = this
        return (
            <div>
                <MuiThemeProvider muiTheme={themes.getDialog()}>
                    <Dialog
                        title={"Confirm passphrase"}
                        actions={<FlatButton
                            label="Next"
                            primary={false}
                            disabled={!self.helpers().isValidCredentials()}
                            onClick={ () => {
                                self.props.onNext(self.state.password)
                            }}
                        />
                        }
                        modal={false}
                        open={self.state.open}
                        onRequestClose={() => {
                            self.helpers().toggleDialog(false)
                        }}>
                        <div className="row">
                            <div className="col-12 mt-4">
                                <TextField
                                    hintText="Re-enter pass phrase.."
                                    fullWidth={true}
                                    hintStyle={{color: '#949494'}}
                                    floatingLabelStyle={dialogStyles.floatingLabelStyle}
                                    floatingLabelFocusStyle={dialogStyles.floatingLabelFocusStyle}
                                    inputStyle={dialogStyles.inputStyle}
                                    underlineStyle={dialogStyles.underlineStyle}
                                    underlineFocusStyle={dialogStyles.underlineStyle}
                                    underlineDisabledStyle={dialogStyles.underlineDisabledStyle}
                                    value={self.state.inputMnemonic}
                                    type="text"
                                    onChange={(event, value) => {
                                        self.setState({
                                            inputMnemonic: value,
                                            error: false
                                        })
                                    }}
                                    onKeyPress={self.helpers().nextWithKeyPress}
                                />
                                {   self.state.error &&
                                <p className="text-danger">Invalid passphrase. Please make sure you&#39;ve entered the
                                    same phrase
                                    that was generated.</p>
                                }
                            </div>
                            <div className="col-12 mt-4">
                                <TextField
                                    type="password"
                                    fullWidth={true}
                                    inputStyle={styles.textField.inputStyle}
                                    hintText="Create password (Minimum 8 chars)"
                                    hintStyle={styles.textField.hintStyle}
                                    floatingLabelStyle={styles.textField.floatingLabelStyle}
                                    floatingLabelFocusStyle={styles.textField.floatingLabelFocusStyle}
                                    underlineStyle={styles.textField.underlineStyle}
                                    underlineFocusStyle={styles.textField.underlineStyle}
                                    value={self.state.password}
                                    onChange={(event, value) => {
                                        self.setState({
                                            password: value
                                        })
                                    }}
                                    onKeyPress={self.helpers().nextWithKeyPress}
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
                                    floatingLabelFocusStyle={styles.textField.floatingLabelFocusStyle}
                                    underlineStyle={styles.textField.underlineStyle}
                                    underlineFocusStyle={styles.textField.underlineStyle}
                                    value={self.state.confirmPassword}
                                    onChange={(event, value) => {
                                        self.setState({
                                            confirmPassword: value
                                        })
                                    }}
                                    onKeyPress={self.helpers().nextWithKeyPress}
                                />
                            </div>
                            <div className="col-12 my-2">
                                <p>Password will be needed to send DBETs or export private key and will remain active
                                    till
                                    log out.</p>
                            </div>
                        </div>
                    </Dialog>
                </MuiThemeProvider>
            </div>
        )
    }

}

export default NextDialog