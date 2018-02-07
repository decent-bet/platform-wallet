import React from 'react'
import { Dialog, FlatButton, MuiThemeProvider } from 'material-ui'

import Themes from '../../Base/Themes'
const themes = new Themes()

export default function LearnMoreDialog({ isOpen, onCloseListener }) {
    return (
        <MuiThemeProvider muiTheme={themes.getDialog()}>
            <Dialog
                title="DBET Token Upgrade Information"
                actions={
                    <FlatButton
                        label="Ok"
                        primary={false}
                        onTouchTap={onCloseListener}
                    />
                }
                modal={false}
                open={isOpen}
                autoScrollBodyContent={true}
                onRequestClose={onCloseListener}
            >
                <p>
                    The Decent.bet token contract has been upgraded to the
                    current version - v2 - which issues the final total supply
                    for the token contract along with a few improvements
                    beneficial for future usage.
                </p>
                <ul>
                    <li>
                        Removal of crowdsale functions resulting in a leaner and
                        easier to use token contract.
                    </li>
                    <li>
                        Switch from throws to reverts for error conditions -
                        which means that error transactions will not consume gas
                        anymore saving transaction fees.
                    </li>
                    <li>
                        Users can not transfer tokens to the token contract
                        anymore - which otherwise would result in tokens being
                        lost forever.
                    </li>
                </ul>
                <p>
                    All tokens from the initial contract will be upgraded at a
                    1:1 rate. If you had 100 DBETs on the initial contract, they
                    will be upgraded to the current contract and removed from
                    the initial contract. The new token contract will also be
                    used for all platform functionality in the future, so please
                    make sure tokens are upgraded as soon as possible.
                </p>
            </Dialog>
        </MuiThemeProvider>
    )
}
