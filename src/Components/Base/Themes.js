import { createMuiTheme } from '@material-ui/core/styles'
import { COLOR_WHITE, COLOR_GOLD, COLOR_PRIMARY, COLOR_BACKGROUND } from './../Constants'

export const mainTheme = createMuiTheme({
    palette: {
        type: 'dark',
        primary: {
            main: COLOR_PRIMARY,
        },
        secondary: {
            main: COLOR_GOLD
        },
        background: {
            paper: COLOR_BACKGROUND,
        }
    },

    typography: {
        fontFamily:
            'Roboto", sans-serif',
            color: COLOR_WHITE
    },

    overrides: {
        MuiDrawer: {
            paper: {
                backgroundColor: COLOR_BACKGROUND
            }
        },
        MuiAppBar: {
            root: {
                height: 60,
                zIndex: 999
            },
            colorPrimary: {
                backgroundColor: COLOR_BACKGROUND
            }
        },
        MuiAvatar: {
            root: {
                backgroundColor: COLOR_BACKGROUND
            }
        },
        MuiToolbar: {
            root: {
                display: 'flex',
                alignItems: 'center'
            }
        },
        MuiButton: {
            root: {
                borderRadius: '2px'
            }
        },
        MuiButtonBase: {
            root: {
                '&:focus': {boxShadow: 'none', outline: 'none'},
                containedPrimary: {
                    color: '#29344f',
                    textTransform: 'capitalize'
                },
                borderRadius: '2px'
            }
        },
        MuiCard: {
            root: {
                borderRadius: '2px'
            }
        }
    }
})


export const lightTheme = createMuiTheme({
    palette: {
      type: 'light',
      primary: {
          main: COLOR_PRIMARY
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
            '"Roboto"',
        button: {
            textTransform: 'capitalize'
        }
    },
    overrides: {
        MuiAvatar: {
            colorDefault: {
                backgroundColor: COLOR_BACKGROUND
            }
        }
    }
  })