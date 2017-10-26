import getMuiTheme from 'material-ui/styles/getMuiTheme';

const constants = require('./../Constants')

class Themes {

    getAppBar() {
        return getMuiTheme({
            palette: {
                textColor: constants.COLOR_WHITE,
                alternateTextColor: constants.COLOR_WHITE,
                primary1Color: constants.COLOR_PRIMARY,
                primary2Color: constants.COLOR_PRIMARY_DARK,
                accent1Color: constants.COLOR_RED,
                canvasColor: constants.COLOR_BLACK
            },
            appBar: {
                height: 60
            }
        })
    }

    getDrawer() {
        return getMuiTheme({
            palette: {
                textColor: constants.COLOR_WHITE,
                alternateTextColor: constants.COLOR_WHITE,
                primary1Color: constants.COLOR_PRIMARY,
                primary2Color: constants.COLOR_PRIMARY_DARK,
                accent1Color: constants.COLOR_RED,
                canvasColor: constants.COLOR_DRAWER_BLACK
            },
            appBar: {
                height: 60
            }
        })
    }

    getSnackbar() {
        return getMuiTheme({
            palette: {
                textColor: constants.COLOR_PRIMARY,
                alternateTextColor: constants.COLOR_WHITE,
                primary1Color: constants.COLOR_PRIMARY,
                primary2Color: constants.COLOR_PRIMARY_DARK,
                accent1Color: constants.COLOR_RED,
                canvasColor: constants.COLOR_PRIMARY
            },
            appBar: {
                height: 60
            }
        })
    }

    getDialog() {
        return getMuiTheme({
            palette: {
                textColor: '#e7b864',
                alternateTextColor: '#e7b864',
                primary1Color: constants.COLOR_PRIMARY,
                primary2Color: constants.COLOR_PRIMARY_DARK,
                accent1Color: constants.COLOR_RED,
                canvasColor: constants.COLOR_PRIMARY
            },
            appBar: {
                height: 60
            }
        })
    }

    getProgressBar() {
        return getMuiTheme({
            palette: {
                primary1Color: constants.COLOR_GOLD,
                primary3Color: '#000000'
            }
        })
    }

    getNotification() {
        return getMuiTheme({
            palette: {
                primary1Color: constants.COLOR_GOLD
            }
        })
    }

}

export default Themes
