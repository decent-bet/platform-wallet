import React from 'react'
import {
    Dialog,
    Slide,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
    Typography
} from '@material-ui/core'
import { FormattedMessage } from 'react-intl'
import { Config } from '../../Config'
const PackageJson = require('../../../../package.json')

function Transition(props) {
    return <Slide direction="up" {...props} />
}

export default function AboutDialog({ isShown, onCloseListener }) {
    return (
        <Dialog
            open={isShown}
            TransitionComponent={Transition}
            onClose={onCloseListener}
        >
            <DialogTitle>{PackageJson.description}</DialogTitle>
            <DialogContent>
                <DialogContentText component="div">
                    <Typography component="div">
                        <FormattedMessage
                            id="src.Components.Dashboard.Dialogs.AboutDialog.Version"
                            description="Version in AboutDialog"
                        />
                        : {PackageJson.version}
                    </Typography>
                    <Typography component="div">Network: {Config.network}</Typography>
                    <Typography component="div">
                        <FormattedMessage
                            id="src.Components.Dashboard.Dialogs.AboutDialog.Repository"
                            description="Repository in AboutDialog"
                        />
                        : {PackageJson.repository}
                    </Typography>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button
                    variant="contained"
                    onClick={onCloseListener}
                    color="primary"
                >
                    OK
                </Button>
            </DialogActions>
        </Dialog>
    )
}
