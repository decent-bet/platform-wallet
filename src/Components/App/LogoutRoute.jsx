import React from 'react'
import { Route } from 'react-router-dom'
import KeyHandler from '../Base/KeyHandler'

const keyHandler = new KeyHandler()

// Whenever this route renders, clear all keys.
export default function LogoutRoute({ component: Component, ...rest }) {
    return (
        <Route
            {...rest}
            render={props => {
                keyHandler.clear() // Clears the keys!
                return <Component {...props} />
            }}
        />
    )
}
