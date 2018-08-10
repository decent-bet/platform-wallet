import React from 'react'
import { Dialog, FlatButton, MuiThemeProvider } from 'material-ui'

import Themes from '../../Base/Themes'
import { FormattedMessage } from 'react-intl'
const themes = new Themes()

export default function VETLearnMoreDialog({ isOpen, onCloseListener }) {
    return (
        <MuiThemeProvider muiTheme={themes.getDialog()}>
            <Dialog
                title="DBET Token Upgrade to VET Information"
                actions={
                    <FlatButton
                        label="Ok"
                        primary={false}
                        onClick={onCloseListener}
                        onTouchTap={onCloseListener}
                    />
                }
                modal={false}
                open={isOpen}
                autoScrollBodyContent={true}
                onRequestClose={onCloseListener}
            >
                <p>
                    <FormattedMessage
                        id="src.Components.Wallet.Dialogs.LearnMoreDialog.Upgraded"
                        description="Token contract has been upgraded in LearnMoreDialog"
                    />
                </p>
                <ul>
                    <li>
                        <FormattedMessage
                            id="src.Components.Wallet.Dialogs.LearnMoreDialog.RemovalOfCrowdsale"
                            description="Removal of crowdsale in LearnMoreDialog"
                        />
                    </li>
                    <li>
                        <FormattedMessage
                            id="src.Components.Wallet.Dialogs.LearnMoreDialog.SwitchFromThrows"
                            description="Switch from throws in LearnMoreDialog"
                        />
                    </li>
                    <li>
                        <FormattedMessage
                            id="src.Components.Wallet.Dialogs.LearnMoreDialog.UsersCanNotTransfer"
                            description="Users can not transfer in LearnMoreDialog"
                        />
                    </li>
                </ul>
                <p>
                    <FormattedMessage
                        id="src.Components.Wallet.Dialogs.LearnMoreDialog.AllTokensWillBeUpgraded"
                        description="All tokens will be upgraded in LearnMoreDialog"
                    />
                </p>
            </Dialog>
        </MuiThemeProvider>
    )
}
