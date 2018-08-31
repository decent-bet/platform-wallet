import React, { Component } from 'react'
import { Button } from '@material-ui/core'
import { Card, CardActions } from '@material-ui/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { injectIntl } from 'react-intl'
import { componentMessages, getI18nFn } from '../../i18n/componentMessages'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'

const messages = componentMessages('src.Components.Send.ActionsPanel', [
    { Loading: 'common.Loading' },
    'SendAll',
    'SendDBETs'
])

const styles = theme => ({
    root: {

    },
    actions: {
        display: 'flex',
        flexDirection: 'column'
    },
    button: {
        margin: theme.spacing.unit
    },
    extendedIcon: {
        marginRight: theme.spacing.unit
    }
})

class ActionsPanel extends Component {
    render() {
        const {
            intl,
            tokenBalance,
            onSelectAllListener,
            onSendListener,
            canSend
        } = this.props
        const i18n = getI18nFn(intl, messages)
        let isLoading = tokenBalance === 0 || tokenBalance === i18n('Loading')
        return (
            <Card className={this.props.classes.root}>
                <CardActions className={this.props.classes.actions}>
                    <Button
                        variant='outlined'
                        fullWidth={true}
                        disabled={isLoading}
                        className={this.props.classes.button}
                        onClick={onSelectAllListener}
                    >
                        {i18n('SendAll')}
                    </Button>
                    <Button
                        disabled={!canSend}
                        variant="contained"
                        color="primary"
                        fullWidth={true}
                        className={this.props.classes.button}
                        onClick={onSendListener}
                    >
                        <FontAwesomeIcon
                            icon="paper-plane"
                            className={this.props.classes.extendedIcon}
                        />
                        {i18n('SendDBETs')}
                    </Button>
                </CardActions>
            </Card>
        )
    }
}

ActionsPanel.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(injectIntl(ActionsPanel))