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

function BalanceCounter({ classes, isLoading, balance, currency }) {
    const loadingMessage = <FormattedMessage id="common.Loading" />
    return (
        <Button className="hidden-md-down" disableRipple="true" disableFocusRipple="true">
            <span>
                <span className={classes.primary}>{currency} </span>
                <span className={classes.default}>
                    {' '}
                    {isLoading ? loadingMessage : balance}
                </span>
            </span>
        </Button>
    )
}
BalanceCounter.propTypes = {
    classes: PropTypes.object.isRequired
}

export default withStyles(styles)(BalanceCounter)
