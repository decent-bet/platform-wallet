import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
    Card,
    CardContent,
    CardActions,
    Button,
    CardHeader
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { FormattedMessage } from 'react-intl'
import LoginInner from './LoginInner.jsx'
import ConfirmationDialog from '../Base/Dialogs/ConfirmationDialog'
import KeyHandler from '../Base/KeyHandler'
import { LOGIN_MNEMONIC, LOGIN_PRIVATE_KEY } from '../Constants'


const ethers = require('ethers')
const Wallet = ethers.Wallet

const keyHandler = new KeyHandler()

const styles = theme => ({
    wrapper: {
        display: 'flex',
        maxWidth: '800px',
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center'
    },
    logo: {
        display: 'flex',
        alignSelf: 'center',
        padding: '10px 5px',
        marginBottom: '1em',
        marginTop: '1em'
    },
    logoImage: {
        maxHeight: '64px'
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    button: {
        flex: '0 auto',
        margin: theme.spacing.unit,
    },
    extendedIcon: {
      marginLeft: theme.spacing.unit,
    },
    loginHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
  })

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            login: LOGIN_MNEMONIC.toString(),
            key: '',
            mnemonic: '',
            password: '',
            confirmPassword: '',
            dialogs: {
                error: {
                    open: false,
                    title: '',
                    message: ''
                }
            }
        }
    }

    signUp = () => {
        let loginType = this.getLoginTypeNumber()

        if (loginType === LOGIN_PRIVATE_KEY)
            this.signUpPrivateKey()
        else if (loginType === LOGIN_MNEMONIC)
            this.signUpMnemonic()
    }

    getLoginTypeNumber() {
        return parseInt(this.state.login)
    }

    signUpPrivateKey = () => {
        try {
            const ethWallet = new Wallet(this.state.key)
            keyHandler.set({
                vetPubAddress: ethWallet.address,
                vetPrivateKey: ethWallet.privateKey,
                address: ethWallet.address,
                privateKey: ethWallet.privateKey,
                password: this.state.password
            })
            this.props.history.push('/')
        } catch (e) {
            let text =
                "Invalid private key. Please make sure you're entering a valid private key"
            this.toggleErrorDialog(true, 'Error', text)
        }
    }


    signUpMnemonic = () => {
        try {
            const vetWallet = Wallet.fromMnemonic(this.state.mnemonic, "m/44'/818'/0'/0")
            const wallet = Wallet.fromMnemonic(this.state.mnemonic)
            keyHandler.set({
                vetPubAddress: vetWallet.address,
                vetPrivateKey: vetWallet.privateKey,
                address: wallet.address,
                privateKey: wallet.privateKey,
                mnemonic: this.state.mnemonic,
                password: this.state.password
            })
            this.props.history.push('/')
        } catch (e) {
            let text =
                "Invalid mnemonic. Please make sure you're entering a valid mnemonic"
            this.toggleErrorDialog(true, 'Error', text)
        }
    }

    toggleErrorDialog = (open, title, message) => {
        let dialogs = this.state.dialogs
        dialogs.error = {
            open: open,
            title: title,
            message: message
        }
        this.setState({
            dialogs: dialogs
        })
    }

    isValidCredentials = () => {
        let loginType = this.getLoginTypeNumber()
        let isMnemonicCorrect = loginType === LOGIN_MNEMONIC && this.state.mnemonic.length > 0
        let isLoginCorrect = loginType === LOGIN_PRIVATE_KEY && this.state.key.length > 0
        let isPasswordCorrect = this.state.password.length >= 8 && this.state.password === this.state.confirmPassword

        return (isLoginCorrect || isMnemonicCorrect) && isPasswordCorrect
    }

    onCloseErrorDialogListener = () => {
        this.toggleErrorDialog(false)
    }

    onKeyPressListener = event => {
        if (event.key === 'Enter') {
            event.preventDefault()
            this.onLoginListener()
        }
    }

    onLoginListener = () => {
        if (this.isValidCredentials()) {
            this.signUp()
        }
    }

    onLoginTypeChangedListener = (event) => {
        this.setState({
            key: '',
            mnemonic: '',
            login: event.target.value
        })
    }

    onSignUpListener = () => this.props.history.push('/new_wallet')

    onMnemonicChangedListener = (event) => {
        const value = event.target.value
        let loginType = this.getLoginTypeNumber()

        if (loginType === LOGIN_PRIVATE_KEY) {
            this.setState({ key: value })
        } else if (loginType === LOGIN_MNEMONIC) {
            this.setState({ mnemonic: value })
        }
    }

    onPasswordChangedListener = (event) => {
        this.setState({ password: event.target.value })
    }

    onPasswordConfirmationChangedListener = (event) => {
        this.setState({ confirmPassword: event.target.value })
    }

    renderLoginButton = () => {
        const { classes } = this.props
        return (
            <Button variant="contained"
                    color="primary"
                    disabled={!this.isValidCredentials()}
                    onClick={this.onLoginListener}
                    className={classes.button}
                >
                <FormattedMessage
                        id="src.Components.Login.LoginButton"
                        description="Login button"
                    />

                <FontAwesomeIcon icon="sign-in-alt" className={classes.extendedIcon}/>
            </Button>
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

    renderCreateAccount = () => {
        const { classes } = this.props
        return (
                <Button variant="contained"
                        color="primary"
                        className={classes.button}
                        onClick={this.onSignUpListener}
                    >
                    <FormattedMessage
                        id="src.Components.Login.CreateNewWalletButton"
                        description="Create new wallet button"
                    />
            </Button>
        )
    }

    renderInnerLoginDialog = () => {
        return (
            <LoginInner
                mnemonic={this.state.mnemonic}
                privateKey={this.state.key}
                loginType={this.state.login}
                password={this.state.password}
                confirmPassword={this.state.confirmPassword}
                onLoginTypeChangedListener={this.onLoginTypeChangedListener}
                onMnemonicChangedListener={this.onMnemonicChangedListener}
                onPasswordChangedListener={this.onPasswordChangedListener}
                onPasswordConfirmationChangedListener={this.onPasswordConfirmationChangedListener}
                onKeyPressListener={this.onKeyPressListener}
            />
        )
    }

    render() {
        let { classes } = this.props
        return (
                <div className={classes.wrapper}>
                        <div className={classes.logo}>
                            <img className={classes.logoImage}
                                 src={
                                    process.env.PUBLIC_URL +
                                    '/assets/img/logos/dbet-white.png'
                                }
                                alt="Decent.bet Logo"
                            />
                        </div>
                        <Card>
                            <CardHeader
                                className={classes.loginHeader}
                                title={<FormattedMessage
                                    id="src.Components.Login.HeaderTitle"
                                    description="Login title"/> }
                                    action={
                                        this.renderCreateAccount()
                                    }
                            >
                            </CardHeader>
                            <CardContent>{this.renderInnerLoginDialog()}</CardContent>
                            <CardActions className={classes.actions}>
                                {this.renderLoginButton()}
                            </CardActions>
                            {this.renderErrorDialog()}
                        </Card>
                </div>
        )
    }
}

Login.propTypes = {
    classes: PropTypes.object.isRequired,
  };

export default withStyles(styles)(Login);
