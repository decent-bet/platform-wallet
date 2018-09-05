import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import PropTypes from 'prop-types'
import { withStyles, MuiThemeProvider } from '@material-ui/core/styles'
import { mainTheme } from '../Base/Themes'
import {
    Snackbar,
    TextField,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Button
} from '@material-ui/core'
import ConfirmationDialog from '../Base/Dialogs/ConfirmationDialog'
import NextDialog from './Dialogs/NextDialog.jsx'
import KeyHandler from '../Base/KeyHandler'
import './newwallet.css'
import { defineMessages, FormattedMessage } from 'react-intl'

const bip39 = require('bip39')
const ethers = require('ethers')
const keyHandler = new KeyHandler()
const Wallet = ethers.Wallet
const messages = defineMessages({
    cardTitle: {
        id: 'src.Components.NewWallet.NewWallet.CardTitle'
    },
    Next: {
        id: 'common.Next'
    },
    Back: {
        id: 'common.Back'
    }
})

const styles = theme => ({
    button: {
        margin: theme.spacing.unit
    },
    extendedIcon: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit
    }
})

class NewWallet extends Component {
    constructor(props) {
        super(props)
        
        this.state = {
            mnemonic: '',
            dialogs: {
                error: {
                    open: false,
                    title: '',
                    message: ''
                },
                next: {
                    open: false
                }
            },
            snackbar: {
                open: false
            }
        }
    }

    componentDidMount = () => {
        this.generateMnemonic()
    }

    generateMnemonic = () => {
        let mnemonic = bip39.generateMnemonic()
        this.setState({ mnemonic: mnemonic })
    }

    toggleErrorDialog = (open, title, message) => {
        let dialogs = this.state.dialogs
        dialogs.error = {
            open: open,
            title: title,
            message: message
        }
        this.setState({ dialogs: dialogs })
    }

    toggleNextDialog = open => {
        let dialogs = this.state.dialogs
        dialogs.next.open = open
        this.toggleSnackbar(false)
        this.setState({ dialogs: dialogs })
    }

    toggleSnackbar = open => {
        let snackbar = this.state.snackbar
        snackbar.open = open
        this.setState({ snackbar: snackbar })
    }

    onCloseErrorDialogListener = () => this.toggleErrorDialog(false)
    onCloseNextDialogListener = open => this.toggleNextDialog(open)
    onGoBackListener = () => this.props.history.goBack()
    onOpenNextDialogListener = () => this.toggleNextDialog(true)

    // Received a passphrase correctly from the "NextDialog".
    // Validate and redirect to Dashboard
    onPassphraseListener = password => {
        let wallet = Wallet.fromMnemonic(this.state.mnemonic)
        keyHandler.set({ mnemonic: this.state.mnemonic, privateKey: wallet.privateKey, address: wallet.address, password })
        this.props.history.push('/')
    }

    renderTop = () => (
        <CardHeader className="card-title"
          title={<FormattedMessage {...messages.cardTitle}>
          </FormattedMessage>}
        />
    )

    renderMnemonic = () => (
        <CardContent className="card-text">
            <p>
                <FormattedMessage
                    id="src.Components.NewWallet.NewWallet.ShowPassphrase"
                    description="Showing the user their new passphrase"
                />:
            </p>
            <p>
            <TextField
                fullWidth={true}
                multiline
                rowsMax="2"
                rows="2"
                margin="normal"
                value={this.state.mnemonic}
            />
            </p>

            <p>
                <FormattedMessage
                    id="src.Components.NewWallet.NewWallet.ShowPassphraseDetailedIntroduction"
                    description="Showing the user their new passphrase, detailed introduction"
                />
            </p>
            <p>
                <FormattedMessage
                    id="src.Components.NewWallet.NewWallet.ShowPassphraseDetailedDescription"
                    description="Showing the user their new passphrase, detailed description"
                />
            </p>
        </CardContent>
    )

    renderButtonBar = () => (
        <CardActions className="card-actions">
        <Button 
                className={this.props.classes.button}
                onClick={this.onGoBackListener}>
            <FontAwesomeIcon 
                className={this.props.classes.extendedIcon}
                icon="arrow-left"/>

            <FormattedMessage {...messages.Back}>
            </FormattedMessage>
        </Button>
        <Button 
                className={this.props.classes.button}
                variant="contained"
                disabled={this.state.mnemonic.length === 0}
                color="primary"
                onClick={this.onOpenNextDialogListener}>
            <FormattedMessage {...messages.Next}>
            </FormattedMessage>
            <FontAwesomeIcon 
                className={this.props.classes.extendedIcon}
                icon="arrow-right"/>
        </Button>
        </CardActions>
    )

    renderSnackbar = () => {
        return (
            <Snackbar
                message="Copied passphrase to clipboard"
                open={this.state.snackbar.open}
                autoHideDuration={3000}
            />
        )
    }

    renderErrorDialog = () => {
        return (
            <ConfirmationDialog
                onClick={this.onCloseErrorDialogListener}
                onClose={this.onCloseErrorDialogListener}
                title={this.state.dialogs.error.title}
                message={this.state.dialogs.error.message}
                open={this.state.dialogs.error.open}
            />
        )
    }

    renderNextDialog = () => {
        return (
            <NextDialog
                onNext={this.onPassphraseListener}
                toggleDialog={this.toggleNextDialog}
                mnemonic={this.state.mnemonic}
                open={this.state.dialogs.next.open}
            />
        )
    }

    render() {
        return (
            <MuiThemeProvider theme={mainTheme}>
            <main className="new-wallet">
                    <Card>
                        {this.renderTop()}
                        {this.renderMnemonic()}
                        {this.renderButtonBar()}
                    </Card>
                    {this.renderErrorDialog()}
                    {this.renderNextDialog()}
                    {this.renderSnackbar()}
            </main>
            </MuiThemeProvider>
        )
    }
}


NewWallet.propTypes = {
    classes: PropTypes.object.isRequired
}
export default withStyles(styles)(NewWallet)
