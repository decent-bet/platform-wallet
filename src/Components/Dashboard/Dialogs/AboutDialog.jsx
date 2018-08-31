import React from 'react'
import {
    Dialog,
    Slide,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button
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
                    <p>
                        <FormattedMessage
                            id="src.Components.Dashboard.Dialogs.AboutDialog.Version"
                            description="Version in AboutDialog"
                        />
                        : {PackageJson.version}
                    </p>
                    <p>Network: Ethereum Rinkeby / Vechain Test</p>
                    <p>
                        <FormattedMessage
                            id="src.Components.Dashboard.Dialogs.AboutDialog.Repository"
                            description="Repository in AboutDialog"
                        />
                        : {PackageJson.repository}
                    </p>
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
