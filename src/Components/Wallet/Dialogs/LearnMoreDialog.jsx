import React from 'react'
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core'
import { FormattedMessage } from 'react-intl'

export default function LearnMoreDialog({ isOpen, onCloseListener }) {
    return (
        <Dialog scroll={'body'} open={isOpen} onClose={onCloseListener}>
            <DialogTitle>DBET Token Upgrade Information</DialogTitle>
            <DialogContent>
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
            </DialogContent>
            <DialogActions>
                <Button
                    color="primary"
                    onClick={onCloseListener}
                    onTouchTap={onCloseListener}
                >
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    )
}
