import React, { Component, Fragment } from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import { RaisedButton, Card, CardText, CardActions } from 'material-ui'
import PurchaseCreditsDialog from './Dialogs/PurchaseCreditsDialog'
import Helper from '../../Helper'
// import HouseStats from './HouseStats'
// import LotteryDetails from './LotteryDetails'
// import LotteryTicketsCard from './LotteryTicketsCard'
// import SessionStats from './SessionStats'
import { BigNumber } from 'bignumber.js'
import ethUnits from 'ethereum-units'
// import { connect } from 'react-redux'
// import { Actions, initWatchers, stopWatchers } from '../../../Model/house'

import './house.css'

const helper = new Helper()

class House extends Component {
    state = {
        isDialogPurchaseCreditsOpen: false
    }

    // TODO: Route through Redux
    // componentDidMount = () => {
    //     this.props.dispatch(Actions.getHouseSessionId())
    //     this.props.dispatch(Actions.getHouseSessionData())
    //     this.props.dispatch(Actions.getHouseAuthorizedAddresses())
    //     this.props.dispatch(Actions.getHouseAllowance())
    //
    //     this.props.dispatch(initWatchers)
    // }

    // componentWillUnmount = () => {
    //     this.props.dispatch(stopWatchers)
    // }

    /**
     * Executes confirmed Credit purchase
     * @param {BigNumber} amount How Much?
     */
    onCreditPurchaseListener = amount => {
        let bigAmount = new BigNumber(amount)
        let ether = bigAmount.times(ethUnits.units.ether)
        let formattedAmount = ether.toFixed()

        // TODO: Route through Redux
        // // Setup action
        // let action = ether.isLessThanOrEqualTo(this.props.house.allowance)
        //     ? Actions.purchaseHouseCredits(formattedAmount)
        //     : Actions.approveAndPurchaseHouseCredits(formattedAmount)
        // this.props.dispatch(action)
    }

    /**
     * Listener that opens the Purchase Dialog
     */
    onOpenPurchaseDialogListener = () =>
        this.setState({ isDialogPurchaseCreditsOpen: true })

    /**
     * Listener to close the Purchase Dialog
     */
    onClosePurchaseDialogListener = () =>
        this.setState({ isDialogPurchaseCreditsOpen: false })

    renderPurchaseCreditDialog = () => {
        const sessionId = 0; //this.props.house.sessionId;
        const onConfirmListener = null; //this.onCreditPurchaseListener
        const allowance= 0; //this.props.house.allowance;
        const balance = this.props.balance;
        const onClosePurchaseDialogListener = this.onClosePurchaseDialogListener
        return <PurchaseCreditsDialog
            isOpen={this.state.isDialogPurchaseCreditsOpen}
            sessionNumber={sessionId}
            onConfirmListener={onConfirmListener}
            allowance={allowance}
            balance={balance}
            onCloseListener={onClosePurchaseDialogListener}
        />
    }

    renderHeader = () => {
        let allowance = 0 //TODO: fix to use Helper //helper.formatEther(this.props.house.allowance)
        return (
            <Fragment>
                <header>
                    <h1 className="text-center">
                        DECENT<span className="color-gold">.BET</span> House
                    </h1>
                </header>

                <Card>
                    <CardText>{`House Allowance: ${allowance} DBETs`}</CardText>
                    <CardActions>
                        <RaisedButton
                            icon={<FontAwesomeIcon icon="money-bill-alt"/>}
                            label="Purchase Credits"
                            secondary={true}
                            fullWidth={true}
                            onClick={this.onOpenPurchaseDialogListener}
                        />
                    </CardActions>
                </Card>
            </Fragment>
        )
    }

    // renderHouseStats = () => {
    //     let currentSession = this.props.house.sessionId
    //     let currentSessionCredits = this.props.house.credits[currentSession]
    //     let availableCredits = currentSessionCredits
    //         ? helper.formatEther(currentSessionCredits)
    //         : '0'
    //     return (
    //         <HouseStats
    //             currentSession={currentSession}
    //             authorizedAddresses={this.props.house.authorizedAddresses}
    //             availableCredits={availableCredits}
    //         />
    //     )
    // }
    //
    // renderLotteryDetails = () => {
    //     let currentSession = this.props.house.sessionId
    //     let currentSessionState = this.props.house.sessionState[currentSession]
    //     if (currentSessionState) {
    //         let currentLottery = currentSessionState.lottery
    //         return (
    //             <Fragment>
    //                 <LotteryTicketsCard lottery={currentLottery} />
    //                 <LotteryDetails lottery={currentLottery} />
    //             </Fragment>
    //         )
    //     } else {
    //         return null
    //     }
    // }
    //
    // renderSessionStats = () => {
    //     let currentSession = this.props.house.sessionId
    //     let currentSessionState = this.props.house.sessionState[currentSession]
    //     if (currentSessionState) {
    //         let houseFunds = currentSessionState.houseFunds
    //         return <SessionStats houseFunds={houseFunds} />
    //     } else {
    //         return null
    //     }
    // }

    render() {
        return (
            <main className="house">
                <div className="container">
                    {this.renderHeader()}
                </div>
                {this.renderPurchaseCreditDialog()}
            </main>
        )
    }
}

// TODO: Route through Redux
export default House
// export default /*connect(state => state)*/(House)
