import React, {Component} from 'react'

import {MuiThemeProvider} from 'material-ui'

import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton'

import Helper from '../../Helper'
import Themes from '../../Base/Themes'

const helper = new Helper()
const themes = new Themes()

class TokenUpgradeDialog extends Component {

    constructor(props) {
        super(props)
        this.state = {
            open: props.open,
            balance: props.balance,
            errors: {
                address: false,
                gasPrice: false
            }
        }
    }

    componentWillReceiveProps = (props) => {
        this.setState({
            open: props.open,
            balance: props.balance,
        })
    }

    helpers() {
        const self = this
        return {
            isValidPositiveNumber: (n) => {
                return (n).toString().length > 0 && n > 0
            }
        }
    }

    render() {
        const self = this
        return (
            <div>
                <MuiThemeProvider muiTheme={themes.getDialog()}>
                    <Dialog
                        title="Token Upgrade"
                        actions={<FlatButton
                            label="Upgrade"
                            primary={false}
                            onTouchTap={ () => {
                                self.props.onUpgrade()
                            }}/>
                        }
                        autoScrollBodyContent={true}
                        modal={false}
                        open={this.state.open}
                        onRequestClose={self.props.onClose}>
                        <div className="container">
                            <div className="row">
                                <div className="col-12">
                                    <p className="mb-1">{self.state.balance} DBETs will be updated from the initial
                                        contract (v1) to the
                                        current contract (v2). Are you sure you would like to continue?</p>
                                    <small>Make sure you have enough Ether to cover gas costs/transaction fees</small>
                                </div>
                            </div>
                        </div>
                    </Dialog>
                </MuiThemeProvider>
            </div>
        )
    }

}

export default TokenUpgradeDialog