import React, { Fragment, Component } from 'react'
import { Button, Snackbar, SnackbarContent } from '@material-ui/core'
import Helper from '../Helper'

const helper = new Helper()
const constants = require('../Constants')

export default class VETTokenUpgradeNotification extends Component {
    render() {
        const {
            v1TokenBalance,
            v2TokenBalance,
            onAccept,
            onLearnMore,
            open,
            close
        } = this.props
        let v1TokenFormatted = helper.formatDbets(this.props.v1TokenBalance)
        let v2TokenFormatted = helper.formatDbets(this.props.v2TokenBalance)
        let text = `Looks like you have ${v2TokenFormatted} V2 tokens remaining in the ERC20 Decent.bet token contract`

        if (v1TokenBalance > 0) {
            text = `Looks like you have ${v1TokenFormatted} V1 tokens and ${v2TokenFormatted} V2 tokens remaining in the ERC20 Decent.bet token contract`
        }

        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                open={open}
                onClose={close}
            >
                <SnackbarContent
                    message={
                        <Fragment key="message">
                            <img
                                src={
                                    process.env.PUBLIC_URL +
                                    '/assets/img/icons/dbet.png'
                                }
                                className="dbet-icon"
                                alt="dbet-icon"
                            />
                            <span>{text}</span>
                        </Fragment>
                    }
                    action={[
                        <Fragment key="action">
                            <Button onClick={onAccept}>
                                Click to upgrade now
                            </Button>
                            <Button onClick={onLearnMore}>Learn more</Button>
                        </Fragment>
                    ]}
                />
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
