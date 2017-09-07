/**
 * Created by user on 9/7/2017.
 */

const constants = require('../Constants')

export const styles = {
    textField: {
        hintStyle: {
            color: constants.COLOR_WHITE_DARK,
        },
        inputStyle: {
            color: constants.COLOR_WHITE
        },
        errorStyle: {
            color: constants.COLOR_ACCENT_DARK,
        },
        underlineStyle: {
            borderColor: constants.COLOR_GOLD,
        },
        floatingLabelStyle: {
            color: constants.COLOR_GOLD,
        },
        floatingLabelFocusStyle: {
            color: constants.COLOR_GOLD,
        }
    },
    dropdown: {
        underlineStyle: {
            borderColor: constants.COLOR_GOLD
        },
        labelStyle: {
            color: constants.COLOR_WHITE
        },
        selectedMenuItemStyle: {
            color: constants.COLOR_WHITE
        },
        menuItemStyle: {
            color: constants.COLOR_WHITE_DARK
        },
        listStyle: {
            backgroundColor: '#000000'
        }
    },
    button: {
        label: {
            color: constants.COLOR_WHITE
        }
    }
}