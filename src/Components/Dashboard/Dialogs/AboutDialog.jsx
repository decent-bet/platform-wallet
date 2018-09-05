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
                <DialogContentText>
                    <Typography>
                        <FormattedMessage
                            id="src.Components.Dashboard.Dialogs.AboutDialog.Version"
                            description="Version in AboutDialog"
                        />
                        : {PackageJson.version}
                    </Typography>
                    <Typography>Network: Ethereum Rinkeby / Vechain Test</Typography>
                    <Typography>
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
