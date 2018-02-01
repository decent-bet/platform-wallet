import React from 'react'
import { Dialog } from 'material-ui'

const PackageJson = require('../../../../package.json')

export default function AboutDialog({ isShown, onCloseListener }) {
    return (
        <Dialog
            open={isShown}
            modal={false}
            onRequestClose={onCloseListener}
            title={PackageJson.description}
        >
            <p>Version: {PackageJson.version}</p>

            <p>Repository: {PackageJson.repository}</p>
        </Dialog>
    )
}
