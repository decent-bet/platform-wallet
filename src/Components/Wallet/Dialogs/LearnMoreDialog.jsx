import React from 'react'
import { Dialog, Button } from '@material-ui/core'
import { FormattedMessage } from 'react-intl'

export default function LearnMoreDialog({ isOpen, onCloseListener }) {
    return (
        <Dialog
                title="DBET Token Upgrade Information"
                actions={
                    <Button
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
    )
}
