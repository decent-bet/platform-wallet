import React, {Component} from 'react'

import {Dialog, FlatButton, MuiThemeProvider} from 'material-ui'

import Themes from '../../Base/Themes'

const constants = require('../../Constants')
const themes = new Themes()

// Inner text of the dialog
function TokenUpgradeDialogInner({ currentEtherBalance, currentTokenBalance }) {
    if (currentEtherBalance === 0) {
        // Error Message: Print this if there is no Ether in the account
        return <p>
            <span className="text-danger">
                There is no Ether in this account! 
            </span>
            <br />
            Please send Ether to your address to cover Gas costs, 
            and then try again later
        </p>
    } else {
        // Normal Message: Transfer details and pricing warning
        return <div>
            <p>
                {currentTokenBalance} DBETs will be updated from the initial
                contract (v1) to the current contract (v2). Are you 
                sure you would like to continue?
            </p>
            <small>
                Ether will be discounted from your wallet to cover
                Gas costs.
            </small>
        </div>
    }
}

class TokenUpgradeDialog extends Component {

    constructor(props) {
        super(props)
        this.state = {
            open: props.open,
            tokenBalance: props.balance,
            ethBalance: props.ethBalance,
            loading: false,
            errors: {
                address: false,
                gasPrice: false
            }
        }

        // Bind the 'this' keyword
        this.onUpgrade = this.onUpgrade.bind(this)
    }

    componentWillReceiveProps(props) {
        this.setState({
            open: props.open,
            tokenBalance: props.balance,
            ethBalance: props.ethBalance,
        })
    }

    onUpgrade(){
        // Upgrade button pressed
        this.props.onUpgrade()
        this.setState({
            loading: true
        })
    }

    render() {
        let currentEtherBalance = parseFloat(this.state.ethBalance)
        let buttonDisabled = currentEtherBalance === 0 ||
            this.state.loading ||
            this.state.tokenBalance === constants.TOKEN_BALANCE_LOADING

        return <MuiThemeProvider muiTheme={themes.getDialog()}>
            <Dialog
                title="Token Upgrade"
                actions={<FlatButton
                    label="Upgrade"
                    primary={false}
                    disabled={buttonDisabled}
                    onClick={this.onUpgrade}/>
                }
                autoScrollBodyContent={true}
                modal={false}
                open={this.state.open}
                onRequestClose={this.props.onClose}>
                <TokenUpgradeDialogInner
                    currentEtherBalance={currentEtherBalance}
                    currentTokenBalance={this.state.tokenBalance}
                    />
            </Dialog>
        </MuiThemeProvider>
    }

}

export default TokenUpgradeDialog