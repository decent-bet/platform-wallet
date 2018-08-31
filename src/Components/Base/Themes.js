import { createMuiTheme } from '@material-ui/core/styles'
import { COLOR_WHITE, COLOR_DRAWER_BLACK, COLOR_GOLD, COLOR_PRIMARY_DARK, COLOR_ACCENT } from './../Constants'

export const mainTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: COLOR_ACCENT
        },
        secondary: {
            main: COLOR_GOLD
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
            color: '#303030',
            textTransform: 'capitalize'
        }
    },

    overrides: {
        MuiDrawer: {
            paper: {
                backgroundColor: COLOR_DRAWER_BLACK
            }
        },
        MuiAppBar: {
            root: {
                height: 60
            },
            colorPrimary: {
                backgroundColor: COLOR_PRIMARY_DARK
            }
        },
        MuiToolbar: {
            root: {
                display: 'flex',
                alignItems: 'center'
            }
        },
        MuiInput: {
            input: {
                fontFamily: 'Inconsolata, monospace'
            }
        },
        MuiButtonBase: {
            root: {
                '&:focus': {boxShadow: 'none', outline: 'none'},
                containedPrimary: {
                    color: COLOR_PRIMARY_DARK
                }
            }
        }
    }
})


export const lightTheme = createMuiTheme({
    palette: {
      type: 'light',
      primary: {
          main: COLOR_ACCENT
      },
      secondary: {
          main: COLOR_GOLD
      },
      background: {
          paper: COLOR_WHITE
      }
    },
    typography: {
        fontFamily:
            '"TradeGothic", "Lato", "Hind", "Oswald", "Arial Narrow", sans-serif',
        button: {
            fontFamily: 'Inconsolata, monospace',
            textTransform: 'capitalize'
        }
    },
    overrides: {
    }
  })