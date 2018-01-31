import React from 'react'
import { FlatButton } from 'material-ui'

import KeyboardKeyList from './KeyboardKeyList.jsx'

const constants = require('../Constants')
const styles = require('../Base/styles').styles

export default class Keyboard extends React.Component {
    renderKeySelectAll = () => {
        let isLoading =
            this.props.tokenBalance === 0 ||
            this.props.tokenBalance === constants.TOKEN_BALANCE_LOADING
        let labelStyle = isLoading
            ? styles.keyboard.send
            : styles.keyboard.sendDisabled
        return (
            <FlatButton
                className="mx-auto d-block"
                disabled={isLoading}
                label={
                    <span>
                        <i className="fa fa-expand mr-2" /> Select All
                    </span>
                }
                onClick={this.props.onSelectAllListener}
                labelStyle={labelStyle}
            />
        )
    }

    renderKeySend = () => {
        let labelStyle = this.props.canSend
            ? styles.keyboard.send
            : styles.keyboard.sendDisabled
        return (
            <FlatButton
                className="mx-auto d-block"
                disabled={!this.props.canSend}
                label={
                    <span>
                        <i className="fa fa-paper-plane-o mr-2" /> Send DBETs
                    </span>
                }
                onClick={this.props.onSendListener}
                labelStyle={labelStyle}
            />
        )
    }

    render() {
        let { onKeyPressedListener } = this.props
        return (
            <div className="container">
                <KeyboardKeyList onKeyPressedListener={onKeyPressedListener} />
                <div className="row py-4">
                    <div className="col-12 mt-4">
                        {this.renderKeySelectAll()}
                    </div>
                    <div className="col-12 mt-4">{this.renderKeySend()}</div>
                </div>
            </div>
        )
    }
}
