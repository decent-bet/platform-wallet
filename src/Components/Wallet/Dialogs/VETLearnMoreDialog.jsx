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
        <Dialog open={isOpen} scroll={'body'} onClose={onCloseListener} stlyle={{zIndex: 99999}}>
            <DialogTitle>DBET Token Upgrade to VET Information</DialogTitle>
            <DialogContent>
            <DialogContentText component="div">
            <Typography align="justify" paragraph={true} variant="body1">
                    <FormattedMessage
                        id="src.Components.Wallet.Dialogs.VETLearnMoreDialog.Upgraded_1"
                        description="Token contract has been upgraded in LearnMoreDialog_1"
                    />
                </Typography>                
                <Typography align="justify" paragraph={true} variant="body1">
                    <FormattedMessage
                        id="src.Components.Wallet.Dialogs.VETLearnMoreDialog.Upgraded_2"
                        description="Token contract has been upgraded in LearnMoreDialog_1"
                    />
                </Typography>
                <Typography align="justify" paragraph={true} variant="body1">
                    <FormattedMessage
                        id="src.Components.Wallet.Dialogs.VETLearnMoreDialog.Upgraded_3"
                        description="Token contract has been upgraded in LearnMoreDialog_1"
                    />
                </Typography>
                <Typography align="justify" paragraph={true} variant="body1">
                    <FormattedMessage
                        id="src.Components.Wallet.Dialogs.VETLearnMoreDialog.Upgraded_4"
                        description="Token contract has been upgraded in LearnMoreDialog_1"
                    />
                </Typography>
            </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCloseListener}>
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    )
}
