import { createMuiTheme } from '@material-ui/core/styles'
import { COLOR_WHITE, COLOR_PRIMARY, COLOR_GOLD, COLOR_GOLD_DARK, COLOR_PRIMARY_DARK, COLOR_ACCENT } from './../Constants'

class Themes {

     _baseTheme = createMuiTheme({
        palette: {
            type: 'dark',
            primary: {
                light: COLOR_GOLD,
                main: COLOR_GOLD_DARK
            },
            secondary: {
                main: COLOR_ACCENT
            },
            background: {
                paper: COLOR_PRIMARY_DARK
            }
        },
    
        typography: {
            fontFamily:
                '"TradeGothic", "Lato", "Hind", "Oswald", "Arial Narrow", sans-serif',
            button: {
                fontFamily: 'Inconsolata, monospace',
                fontSize: '0.75rem',
                textTransform: 'capitalize'
            }
        },
    
        overrides: {
            MuiAppBar: {
                colorPrimary: {
                    backgroundColor: COLOR_PRIMARY_DARK
                }
            },
            MuiInput: {
                input: {
                    fontFamily: 'Inconsolata, monospace'
                }
            }
        }
    })

    getMainTheme() {
        return this._baseTheme
    }

    getDrawer() {
        return this._baseTheme
        /*return getMuiTheme({
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
        }) */
    }

    getSnackbar() {
        return this._baseTheme
        /*return getMuiTheme({
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
        })*/
    }

    getDialog() {
        return this._baseTheme
        /*
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
        })*/
    }

    getProgressBar() {
        return this._baseTheme
        /*
        return getMuiTheme({
            palette: {
                primary1Color: constants.COLOR_GOLD,
                primary3Color: '#000000'
            }
        })*/
    }

    getNotification() {
        return this._baseTheme
        /*
        return getMuiTheme(lightBaseTheme, {
            palette: {
                primary1Color: constants.COLOR_GOLD
            }
        }) */
    }
}

export default Themes
