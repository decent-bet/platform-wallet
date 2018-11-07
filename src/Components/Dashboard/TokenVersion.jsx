import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Button } from '@material-ui/core'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

const styles = theme => ({
    primary: {
        color: theme.palette.primary.light
    },
    default: {
        color: theme.palette.common.white
    }
})

function TokenVersion({ classes, isLoading, selectedToken }) {
    const loadingMessage = <FormattedMessage id="common.Loading" />
    return (
        <Button disableRipple={true} disableFocusRipple={true}>
            <span>
            <span className={classes.primary}>Token Version</span>
                <span className={classes.default}>
                    {' '}
                    {isLoading ? loadingMessage : selectedToken}
                </span>
            </span>
        </Button>
    )
}
TokenVersion.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(TokenVersion)
