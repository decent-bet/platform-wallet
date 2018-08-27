import React from 'react'
import { Button } from '@material-ui/core'
import { Backspace } from '@material-ui/icons'

const constants = require('../Constants')
const KEYCOUNT = 12

function getFormattedKey(k) {
    if (k < constants.KEY_DOT) return k
    switch (k) {
        case constants.KEY_DOT:
            return '.'
        case constants.KEY_ZERO:
            return '0'
        case constants.KEY_BACKSPACE:
            return <Backspace />
        default:
            // Should not happen
            return <span />
    }
}

export default function KeyboardKeyList({ onKeyPressedListener }) {
    let result = []
    for (let index = 1; index <= KEYCOUNT; index++) {
        result.push(
            <div className="col-4" key={index}>
                <Button
                    label={getFormattedKey(index)}
                    fullWidth={true}
                    className="mx-auto d-block key"
                    rippleColor={constants.COLOR_GOLD}

                    // Sends state upstream
                    onClick={onKeyPressedListener}
                    data-keyboard-key={index}
                />
            </div>
        )
    }
    return <div className="row key-left">{result}</div>
}