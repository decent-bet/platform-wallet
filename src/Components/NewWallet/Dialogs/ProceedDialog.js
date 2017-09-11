import React, {Component} from 'react'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'
import TextField from 'material-ui/TextField'

import Themes from './../../Base/Themes'
const themes = new Themes()

const styles = require('./../../Base/DialogStyles').styles

/**
 * Dialog to verify whether the user has saved the mnemonic in a safe place
 */
class ProceedDialog extends Component {

    constructor(props) {
        super(props)
        this.state = {
            open: false,
            error: false,
            mnemonic: props.mnemonic,
            inputMnemonic: ''
        }
    }

    componentWillReceiveProps = (props) => {
        this.setState({
            open: props.open,
            mnemonic: props.mnemonic,
            error: false,
            inputMnemonic: ''
        })
    }

    toggleDialog = (enabled) => {
        this.props.toggleDialog(enabled)
    }

    render() {
        const self = this
        return (
            <div>
                <MuiThemeProvider muiTheme={themes.getDialog()}>
                    <Dialog
                        title={"Confirm seed phrase"}
                        actions={<FlatButton
                            label="Proceed"
                            primary={false}
                            onClick={ () => {
                                if (self.state.mnemonic == self.state.inputMnemonic)
                                    self.props.onProceed()
                                else {
                                    self.setState({
                                        error: true
                                    })
                                }
                            }}
                        />
                        }
                        modal={false}
                        open={self.state.open}
                        onRequestClose={() => {
                            this.toggleDialog(false)
                        }}>
                        <TextField
                            hintText="Re-enter seed phrase.."
                            fullWidth={true}
                            hintStyle={{color: '#949494'}}
                            floatingLabelStyle={styles.floatingLabelStyle}
                            floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
                            inputStyle={styles.inputStyle}
                            underlineStyle={styles.underlineStyle}
                            underlineFocusStyle={styles.underlineStyle}
                            underlineDisabledStyle={styles.underlineDisabledStyle}
                            value={self.state.inputMnemonic}
                            type="text"
                            onChange={(event, value) => {
                                self.setState({
                                    inputMnemonic: value,
                                    error: false
                                })
                            }}
                        />
                        {   self.state.error &&
                        <p className="text-danger">Invalid seed phrase. Please make sure you've entered the same phrase
                            that was generated.</p>
                        }
                    </Dialog>
                </MuiThemeProvider>
            </div>
        )
    }

}

export default ProceedDialog