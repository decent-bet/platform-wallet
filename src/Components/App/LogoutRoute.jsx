import React from 'react'
import { Redirect } from 'react-router-dom'
import KeyHandler from '../Base/KeyHandler'

const keyHandler = new KeyHandler()

export default function LogoutRoute({from, to}) {
    keyHandler.clear()
    return <Redirect from={from} to={to} />
}
