import React from 'react'
import { FlatButton } from 'material-ui'

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
            return <i className='fa fa-arrow-left' />
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
                <FlatButton
                    label={getFormattedKey(index)}
                    fullWidth={true}
                    className="mx-auto d-block key"

                    // Sends state upstream
                    onClick={onKeyPressedListener}
                    data-keyboard-key={index}
                />
            </div>
        )
    }
    return <div className="row key-left">{result}</div>
}