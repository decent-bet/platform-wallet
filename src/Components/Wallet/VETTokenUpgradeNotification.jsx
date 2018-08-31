import React, { Component } from 'react'
import { Button, Avatar, Typography, Snackbar, IconButton, SnackbarContent, Slide, Card, CardHeader, CardContent, CardActions } from '@material-ui/core'
import Helper from '../Helper'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

const helper = new Helper()


const styles = theme => ({
    root: {
        backgroundColor: theme.palette.common.white,
    },
    actions: {
        display: 'flex',
        flexDirection: 'column'
    },
    button: {
        margin: theme.spacing.unit
    },
    extendedIcon: {
        marginRight: theme.spacing.unit
    }
})



function TransitionRight(props) {
    return <Slide {...props} direction="right" />;
  }

class VETTokenUpgradeNotification extends Component {

    renderSnackCard = () => {

        let v1TokenFormatted = helper.formatDbets(this.props.v1TokenBalance)
        let v2TokenFormatted = helper.formatDbets(this.props.v2TokenBalance)
        let text = `Looks like you have ${v2TokenFormatted} V2 tokens remaining in the ERC20 Decent.bet token contract`

        if (this.props.v1TokenBalance > 0) {
            text = `Looks like you have ${v1TokenFormatted} V1 tokens and ${v2TokenFormatted} V2 tokens remaining in the ERC20 Decent.bet token contract`
        }

        return (
            <Card>
            <CardHeader
              avatar={
                <Avatar aria-label="Recipe">
                    <img
                                    src={
                                        process.env.PUBLIC_URL +
                                        '/assets/img/icons/dbet.png'
                                    }
                                    className="dbet-icon"
                                    alt="dbet-icon"
                                />
                </Avatar>
              }
              action={
                <IconButton>
                        <FontAwesomeIcon
                            icon="times"
                        />
                </IconButton>
              }
              title="Token Migration to Vechain Thor (VET)"
            />
            <CardContent>
              <Typography component="p">
              {text}
              </Typography>
            </CardContent>
            </Card>
        )
    }

    render() {

        return (
            <Snackbar
                TransitionComponent={TransitionRight}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right'
                }}
                open={this.props.open}
                onClose={this.props.close}
            >   
            <SnackbarContent
            message={this.renderSnackCard()}
            action={(
                        <span>
                            <Button onClick={this.props.onAccept}>
                                Click to upgrade now
                            </Button>
                            <Button onClick={this.props.onLearnMore}>
                                Learn more
                            </Button>
                        </span>
                    )}>
            </SnackbarContent>
            </Snackbar>
        )
    }
    // return {
    //     onAcceptListener,
    //     onLearnMoreListener,
    //     title: 'Token Migration to Vechain Thor (VET)',
    //     additionalText: text,
    //     icon: (
    //         <img
    //             src={process.env.PUBLIC_URL + '/assets/img/icons/dbet.png'}
    //             className="dbet-icon"
    //             alt="dbet-icon"
    //         />
    //     ),
    //     iconBadgeColor: constants.COLOR_TRANSPARENT,
    //     overflowText: (
    //         <Fragment>
    //             <Button
    //                 onClick={onAcceptListener}
    //             >Click to upgrade now</Button>
    //             <Button onClick={onLearnMoreListener}>Learn more</Button>
    //         </Fragment>
    //     ),
    //     style: {
    //         height: '100% !important',
    //         whiteSpace: 'inherit !important',
    //         overflow: 'inherit !important'
    //     }
    // }
}



VETTokenUpgradeNotification.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(VETTokenUpgradeNotification)