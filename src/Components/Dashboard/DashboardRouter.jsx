import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Send from '../Send'
import Wallet from '../Wallet'

export default class DashboardRouter extends Component {
    // React Router: Renders the "Send" screen
    routeSend = props => (
        <Send
            vthoBalance={this.props.vthoBalance}
            ethBalance={this.props.ethBalance}
            selectedTokenContract={this.props.selectedTokenContract}
            {...props}
        />
    )

    // React Router: Renders the 'Wallet' screen
    routeWallet = props => (
        <Wallet
            {...props}
            vthoBalance={this.props.vthoBalance}
            ethBalance={this.props.ethBalance}
            selectedTokenContract={this.props.selectedTokenContract}
        />
    )

    render() {
        // React Router: Chooses the view to Render inside
        return (
            <Switch>
                <Route exact path="/" render={this.routeWallet} />
                <Route path="/send" render={this.routeSend} />
            </Switch>
        )
    }
}
