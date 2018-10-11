import React, { Component } from 'react'
import {
    Button,
    Avatar,
    Snackbar,
    IconButton,
    SnackbarContent,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Divider,
    Typography
} from '@material-ui/core'
import Close from '@material-ui/icons/Close'
import Helper from '../Helper'
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { lightTheme } from '../Base/Themes'

const helper = new Helper()

const styles = () => ({
    snack: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        zIndex: '777 !important'
    },
    card: {
        boxShadow: 'none'
    },
    cardTitle: {
        fontWeight: 'bold',
        fontSize: '1.1em'
    },
    content: {
        padding: 0,
        margin: 0,
        backgroundColor: 'transparent',
        '&:first-child': {
            backgroundColor: 'transparent',
            boxShadow: 'none'

        }
    },
  actions: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
})

class VETTokenUpgradeNotification extends Component {
    renderSnackCard = () => {
        let v1TokenFormatted = helper.formatDbets(this.props.v1TokenBalance)
        let v2TokenFormatted = helper.formatDbets(this.props.v2TokenBalance)
        let text = `Looks like you have ${v2TokenFormatted} V2 tokens remaining in the ERC20 Decent.bet token contract`

        if (this.props.v1TokenBalance > 0) {
            text = `Looks like you have ${v1TokenFormatted} V1 tokens and ${v2TokenFormatted} V2 tokens remaining in the ERC20 Decent.bet token contract`
        }
        return (
            <Card className={this.props.classes.card}>
                <CardHeader
                    avatar={
                        <Avatar aria-label="Recipe" color="default">
                            <img
                                style={{ width: '100%' }}
                                src={
                                    process.env.PUBLIC_URL +
                                    '/assets/img/icons/dbet.png'
                                }
                            />
                        </Avatar>
                    }
                    action={
                        <IconButton onClick={this.props.close}>
                            <Close />
                        </IconButton>
                    }
                    title={
                        <Typography className={this.props.classes.cardTitle}>
                            Token Migration to Vechain Thor (VET)
                        </Typography>
                    }
                    subheader={text}
                />
                <CardContent>
                    <Divider />
                </CardContent>
                <CardActions className={this.props.classes.actions}>
                    <Button color="primary" onClick={this.props.onAccept}>
                        Click to upgrade now
                    </Button>
                    <Button onClick={this.props.onLearnMore}>Learn more</Button>
                </CardActions>
            </Card>
        )
    }

    render() {
        return (
            <MuiThemeProvider theme={lightTheme}>
                <Snackbar
                className={this.props.classes.snack}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                    }}
                    open={this.props.open}
                    onClose={this.props.close}
                >
                    <SnackbarContent
                        className={this.props.classes.content}
                        message={this.renderSnackCard()}
                    />
                </Snackbar>
            </MuiThemeProvider>
        )
    }
}

VETTokenUpgradeNotification.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(VETTokenUpgradeNotification)
