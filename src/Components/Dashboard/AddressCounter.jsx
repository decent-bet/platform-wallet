import React from 'react'
import { Button } from '@material-ui/core'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    primary: {
        color: theme.palette.primary.light
  },
  default: {
    color: theme.palette.common.white
  }
})

function AddressCounter({ classes, address, listener }) {
    
    return (
        <Button>
            <CopyToClipboard text={address} onCopy={listener}>
                <span>
                <span className={classes.primary}>
                <FormattedMessage id="src.Components.Dashboard.AddressCounter.PublicAddress" 
                        description="Public Address"/>
                </span>
                <span className={classes.default}> {address}</span>
                </span>
            </CopyToClipboard>
        </Button>
    )
}

AddressCounter.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(AddressCounter);
