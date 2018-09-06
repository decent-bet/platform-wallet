import React from 'react'
import {
    Card,
    Avatar,
    CardHeader,
    CardContent,
    CardActions
} from '@material-ui/core'
import { Button } from '@material-ui/core'
import { injectIntl } from 'react-intl'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { withStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import { componentMessages, getI18nFn } from '../../i18n/componentMessages'
import Typography from '@material-ui/core/Typography'
const messages = componentMessages('src.Components.Wallet.WalletBalance', [
    'TotalDBETs',
    'SendDBETs'
])

const styles = theme => ({
    button: {
        margin: theme.spacing.unit
    },
    actions: {
        display: 'flex',
        justifyContent: 'center'
    },
    icon: {
        width: '5rem',
        height: '5rem',
        margin: '20px 0 0 20px',
        marginBottom: '10px',
        marginLeft: '30px',
    },
    extendedIcon: {
        marginRight: theme.spacing.unit
    },
    balance: {
        '& > p': {fontSize: '4.5rem'},
        display: 'flex',
        flexFlow: 'row nowrap',
        margin: '20px 0px',
        alignItems: 'center',
        justifyContent: 'center',
        '& > *': {
            flex: '0 auto'
        }
    }
})

function WalletBalance({ classes, intl, onSendListener, tokenBalance }) {
    const i18n = getI18nFn(intl, messages)
    let imageSrc = `${process.env.PUBLIC_URL}/assets/img/icons/dbet.png`

    return (
        <Card>
            <CardHeader title={i18n('TotalDBETs')} />
            <CardContent className={classes.balance}>
                <Typography variant="display2">{tokenBalance}</Typography>
                <Avatar
                    className={classes.icon}
                    src={imageSrc}
                    alt="dbet-icon"
                />
            </CardContent>

            <CardActions className={classes.actions}>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={onSendListener}
                >
                    <FontAwesomeIcon
                        icon="paper-plane"
                        className={classes.extendedIcon}
                    />
                    {i18n('SendDBETs')}
                </Button>
            </CardActions>
        </Card>
    )
}

WalletBalance.propTypes = {
    classes: PropTypes.object.isRequired
}
export default withStyles(styles)(injectIntl(WalletBalance))
