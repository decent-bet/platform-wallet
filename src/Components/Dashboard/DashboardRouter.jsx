import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'

import Send from '../Send'
import Wallet from '../Wallet'
import House from './House'

export default class DashboardRouter extends Component {
    // React Router: Renders the "Send" screen
    routeSend = props => (
        <Send
            selectedTokenContract={this.props.selectedTokenContract}
            {...props}
        />
    )

    // React Router: Renders the 'Wallet' screen
    routeWallet = props => (
        <Wallet
            {...props}
            selectedTokenContract={this.props.selectedTokenContract}
            onRefresh={this.initEthBalance}
        />
    )
    // React Router: Renders the 'Wallet' screen
    routeHouse = props => (
        <House
            {...props}
            selectedTokenContract={this.props.selectedTokenContract}
        />
    )

    render() {
        // React Router: Chooses the view to Render inside
        return (
            <Switch>
                <Route exact path="/" render={this.routeWallet} />
                <Route path="/send" render={this.routeSend} />
                <Route path="/house" render={this.routeHouse} />
            </Switch>
        )
    }
}
