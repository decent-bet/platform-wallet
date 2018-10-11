import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import KeyHandler from '../Base/KeyHandler'
import Web3Loader from '../Base/Web3Loader'

const keyHandler = new KeyHandler()
const web3Loader = new Web3Loader()

// Protects a route using a 'Login' system.
// Inspiration: https://reacttraining.com/react-router/web/example/auth-workflow
export default function PrivateRoute({ component: Component, ...rest }) {
    return (
        <Route
            {...rest}
            render={props => {
                // Do Login
                if (keyHandler.isLoggedIn()) {
                    // User logged in
                    web3Loader.init()
                    return <Component {...props} />
                } else {
                    // Redirect to login screen
                    return (
                        <Redirect
                            to={{
                                pathname: '/login',
                                state: { from: props.location }
                            }}
                        />
                    )
                }
            }}
        />
    )
}
