import React, { cloneElement, Component } from 'react'
import { MuiThemeProvider } from '@material-ui/core'
import {
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
    Button
} from '@material-ui/core'
import Divider from '@material-ui/core/Divider'
import IconButton from '@material-ui/core/IconButton'
import Grow from '@material-ui/core/Grow'
import Themes from '../../Base/Themes'
import Close from '@material-ui/icons/Close'
import Avatar from '@material-ui/core/Avatar'
const themes = new Themes()

const classes = {
    root: {
        width: '100%',
        maxWidth: 360,
        foregroundColor: 'black'
    }
}
export class MigrationNotification extends Component {
    constructor() {
        super()
    }

    /**
     * default props
     */
    static defaultProps = {
        rootStyle: {
            bottom: 20,
            right: 25
        }
    }

    // merge local styles and overriding styles and return it
    getStyle = () => {
        const style = window.matchMedia('(max-width: 767px)').matches
            ? {
                  position: 'fixed',
                  zIndex: 1,
                  width: '90%',
                  maxWidth: '325px',
                  bottom: '0%',
                  left: '50%',
                  transform: 'translateX(-50%)'
              }
            : {
                  position: 'fixed',
                  zIndex: 1,
                  width: '90%',
                  maxWidth: '450px',
                  bottom: '0%'
              }

        return Object.assign(style, this.props.rootStyle)
    }

    // /**
    //  * get the props we want to forward to the notification
    //  */
    // getProps = (props) => {
    //     let {children, rootStyle, maxNotifications, ...pProps} = this.props
    //     return Object.assign(props, pProps)
    // }
    getNotificationIcon = () => {
        /**
         * only show notification icon if it is passes
         */
        let iconEl
        if (this.props.icon) {
            /**
             * if personalised then render an avatar with the icon
             */
            if (this.props.personalised) {
                let leftIconBodyStyle = {
                        top: 4,
                        margin: 0,
                        left: 8,
                        width: 'auto',
                        height: 'auto'
                    },
                    leftAvatarStyle = {
                        textAlign: 'center'
                    },
                    leftIconStyle = {
                        position: 'absolute',
                        padding: 4,
                        right: -6,
                        bottom: -4,
                        borderRadius: '50%',
                        backgroundColor: this.props.iconBadgeColor,
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: 'flex'
                    },
                    leftIcon = cloneElement(this.props.icon, {
                        color: this.props.iconFillColor,
                        style: {
                            width: 12,
                            height: 12
                        }
                    })
                iconEl = (
                    <div style={leftIconBodyStyle}>
                        <Avatar
                            src={this.props.avatar}
                            size={44}
                            style={leftAvatarStyle}
                        />
                        <div style={leftIconStyle}>{leftIcon}</div>
                    </div>
                )
            } else {
                let leftIconBodyStyle = {
                        height: 32,
                        width: 32,
                        top: 4,
                        padding: 6,
                        margin: 0,
                        left: 8,
                        borderRadius: '50%',
                        backgroundColor: this.props.iconBadgeColor,
                        justifyContent: 'center',
                        alignItems: 'center',
                        display: 'flex'
                    },
                    leftIcon = cloneElement(this.props.icon, {
                        color: this.props.iconFillColor,
                        style: {
                            margin: 0
                        }
                    })
                iconEl = <div style={leftIconBodyStyle}>{leftIcon}</div>
            }
        }
        return iconEl
    }

    render() {
        const iconButtonStyle = {
                width: 36,
                height: 36,
                top: -3,
                right: 4,
                padding: 6
            },
            iconStyle = {
                height: 18,
                width: 18
            },
            listItemStyle = {
                padding: this.props.icon ? '8px 8px 0 72px' : '8px 8px 0 12px'
            },
            listStyle = {
                position: 'relative'
            },
            overflowStyle = {
                padding: '12px 0 12px 72px'
            },
            overflowContentStyle = {
                paddingLeft: 72
            },
            secondaryTextStyle = {
                marginTop: 8,
                marginBottom: 8,
                height: '100%',
                whiteSpace: 'inherit'
            },
            timestampStyle = {
                position: 'absolute',
                right: this.props.desktop ? 42 : 8,
                fontSize: 12,
                top: 14
            }

        /**
         * secondary line text
         */
        let secondaryText,
            expandedText,
            expandedAction,
            desktopClose,
            timestampEl
        if (this.props.additionalText) {
            secondaryText = (
                <div style={secondaryTextStyle}>
                    {this.props.additionalText}
                </div>
            )
        }
        /**
         * if overflow text is present then show these expanded items
         */
        if (this.props.overflowText) {
            expandedText = (
                <span>
                    <Divider inset={true} />
                    <div style={overflowStyle}>{this.props.overflowText}</div>
                </span>
            )
        } else {
            expandedText = <span />
        }

        /**
         * if overflow content is present then show these expanded items
         */
        if (this.props.overflowContent) {
            expandedAction = (
                <span>
                    <Divider inset={true} />
                    <div style={overflowContentStyle}>
                        {this.props.overflowContent}
                    </div>
                </span>
            )
        } else {
            expandedAction = <span />
        }

        /**
         * show icon button if on desktop
         */
        if (this.props.desktop) {
            desktopClose = (
                <IconButton
                    style={iconButtonStyle}
                    iconStyle={iconStyle}
                    onTouchTap={this.onCloseNotification}
                >
                    <Close />
                </IconButton>
            )
        }

        /**
         * show the timestamp if the string is filled
         */
        if (this.props.timestamp) {
            timestampEl = (
                <div style={timestampStyle}>{this.props.timestamp}</div>
            )
        }

        // return (
        //     <MuiThemeProvider theme={themes.getMainTheme()}>
        //     <div className={classes.root}>
        //         <List style={listStyle}>
        //             <ListItem
        //                 button
        //                 disabled={this.props.onClick ? false : true}
        //                 onClick={e => {
        //                     e.preventDefault()
        //                     if (this.props.onClick) {
        //                         this.props.onClick()
        //                     }
        //                 }}
        //             >
        //                 {/* <ListItemIcon>{this.getNotificationIcon()}</ListItemIcon> */}
        //                 {/* secondaryTextLines={this.props.additionalLines} */}
        //                 {/* innerDivStyle={listItemStyle} */}
        //                 <ListItemText
        //                     inset={true}
        //                     primary={this.props.title}
        //                     secondary={secondaryText}
        //                 />
        //             </ListItem>
        //             {timestampEl}
        //         </List>
        //         {expandedAction}
        //         {expandedText}
        //     </div>
        //     </MuiThemeProvider>
        // )
        // console.log(this.props)
                return (
                    <div>
                        <div>{this.props.additionalText}</div>
                    
                        {expandedText}
                    </div>
                )
    }
}
