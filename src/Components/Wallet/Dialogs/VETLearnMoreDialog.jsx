import React from 'react'
import {
    Dialog,
    Button,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Typography
} from '@material-ui/core'
import { FormattedMessage } from 'react-intl'

export default function VETLearnMoreDialog({ isOpen, onCloseListener }) {
    return (
        <Dialog open={isOpen} scroll={'body'} onClose={onCloseListener}>
            <DialogTitle>DBET Token Upgrade to VET Information</DialogTitle>
            <DialogContent>
            <DialogContentText>
            <Typography>
                    <FormattedMessage
                        id="src.Components.Wallet.Dialogs.LearnMoreDialog.Upgraded"
                        description="Token contract has been upgraded in LearnMoreDialog"
                    />
                </Typography>
                <Typography>
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
                </Typography>
                <Typography>
                    <FormattedMessage
                        id="src.Components.Wallet.Dialogs.LearnMoreDialog.AllTokensWillBeUpgraded"
                        description="All tokens will be upgraded in LearnMoreDialog"
                    />
                </Typography>
            </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCloseListener} onTouchTap={onCloseListener}>
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    )
}
