import React from 'react'
import { Dialog } from 'material-ui'
import { FormattedMessage } from 'react-intl'

const PackageJson = require('../../../../package.json')

export default function AboutDialog({ isShown, onCloseListener }) {
    return (
        <Dialog
            open={isShown}
            modal={false}
            onRequestClose={onCloseListener}
            title={PackageJson.description}
        >
            <p>
                <FormattedMessage
                    id="src.Components.Dashboard.Dialogs.AboutDialog.Version"
                    description="Version in AboutDialog"
                />: {PackageJson.version}
            </p>

            <p>
                <FormattedMessage
                    id="src.Components.Dashboard.Dialogs.AboutDialog.Repository"

                    description="Repository in AboutDialog"
                />: {PackageJson.repository}
            </p>
        </Dialog>
    )
}
