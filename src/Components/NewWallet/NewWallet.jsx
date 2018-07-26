import React, { Component } from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

import {
    MuiThemeProvider,
    Snackbar,
    TextField,
    Card,
    CardTitle,
    CardText,
    CardActions,
    RaisedButton
} from 'material-ui'

import ConfirmationDialog from '../Base/Dialogs/ConfirmationDialog'
import NextDialog from './Dialogs/NextDialog.jsx'

import KeyHandler from '../Base/KeyHandler'
import Themes from './../Base/Themes'

import './newwallet.css'
import { defineMessages, FormattedMessage } from 'react-intl'
import WalletWrapper from "../WalletWrapper/WalletWrapper";
import GuessCurrency from "../WalletWrapper/GuessCurrency";

const bip39 = require('bip39')
const ethers = require('ethers')
const keyHandler = new KeyHandler()
const themes = new Themes()
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

    componentWillMount = () => {
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
        const currency = GuessCurrency.fromMnemonic(this.state.mnemonic)
        const wallet = new WalletWrapper(currency, mnemonic)
        keyHandler.set(currency, wallet.privateKey, wallet.address, password)
        this.props.history.push('/')
    }

    renderTop = () => (
        <FormattedMessage {...messages.cardTitle}>
            {msg => <CardTitle className="card-title" title={msg} />}
        </FormattedMessage>
    )

    renderMnemonic = () => (
        <CardText className="card-text">
            <p>
                <FormattedMessage
                    id="src.Components.NewWallet.NewWallet.ShowPassphrase"
                    description="Showing the user their new passphrase"
                />:
            </p>
            <TextField
                id="input-mnemonic"
                type="text"
                fullWidth={true}
                multiLine={true}
                value={this.state.mnemonic}
            />

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
        </CardText>
    )

    renderButtonBar = () => (
        <CardActions className="card-actions">
            <FormattedMessage {...messages.Back}>
                {msg => (
                    <RaisedButton
                        onClick={this.onGoBackListener}
                        label={msg}
                        icon={<FontAwesomeIcon icon="arrow-left"/>}
                    />
                )}
            </FormattedMessage>
            <FormattedMessage {...messages.Next}>
                {msg => (
                    <RaisedButton
                        primary={true}
                        disabled={this.state.mnemonic.length === 0}
                        onClick={this.onOpenNextDialogListener}
                        label={msg}
                        labelPosition="before"
                        icon={<FontAwesomeIcon icon="arrow-right" />}
                    />
                )}
            </FormattedMessage>
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
            <MuiThemeProvider muiTheme={themes.getMainTheme()}>
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

export default NewWallet
