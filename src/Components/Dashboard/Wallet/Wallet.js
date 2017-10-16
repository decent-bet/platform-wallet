/**
 * Created by user on 9/11/2017.
 */

import React, {Component} from 'react'
import {List, ListItem} from 'material-ui/List'
import Card from 'material-ui/Card'
import DropDownMenu from 'material-ui/DropDownMenu'
import MenuItem from 'material-ui/MenuItem'

import Helper from '../../Helper'

const helper = new Helper()

const constants = require('../../Constants')

import './wallet.css'
import {RaisedButton} from "material-ui"

const styles = {
    card: {
        padding: '20px 5px 20px 5px',
        borderRadius: 8,
        cursor: 'pointer',
        minHeight: 150
    },
    button: {
        label: {
            color: constants.COLOR_WHITE,
            whiteSpace: 'nowrap',
            overflow: 'hidden'
        }
    }
}

class Wallet extends Component {

    constructor(props) {
        super(props)
        let ethNetwork = helper.getWeb3().version.network
        ethNetwork = ethNetwork <= parseInt(constants.ETHEREUM_NETWORK_KOVAN) ?
            ethNetwork : constants.ETHEREUM_NETWORK_LOCAL
        console.log('Ethereum Network', ethNetwork)
        console.log('Address', helper.getWeb3().eth.defaultAccount.address)
        this.state = {
            ethNetwork: ethNetwork,
            balance: 0,
            address: helper.getWeb3().eth.defaultAccount.address,
            transactions: [{
                from: "321",
                to: helper.getWeb3().eth.defaultAccount.address,
                value: 35000,
                date: new Date()
            }, {
                from: helper.getWeb3().eth.defaultAccount.address,
                to: "123",
                value: 4500,
                date: new Date()
            }, {
                from: helper.getWeb3().eth.defaultAccount.address,
                to: "321",
                value: 780,
                date: new Date()
            }]
        }
    }

    componentWillMount = () => {
        this.initData()
        this.initWatchers()
    }

    initData = () => {
        this.web3Getters().dbetBalance()
    }

    initWatchers = () => {
        this.watchers().transferFrom()
        this.watchers().transferTo()
    }

    watchers = () => {
        const self = this
        return {
            transferFrom: () => {
                helper.getContractHelper().getWrappers().token()
                    .logTransfer(self.state.address, true).watch((err, event) => {
                    console.log('transferFrom', err, JSON.stringify(event))
                    if (!err) {
                        const from = event.args.from
                        const to = event.args.to
                        const value = event.args.value

                        self.helpers().addTransaction(from, to, value.toString())
                    }
                })
            },

            transferTo: () => {
                helper.getContractHelper().getWrappers().token()
                    .logTransfer(self.state.address, false).watch((err, event) => {
                    console.log('transferTo', err, JSON.stringify(event))
                    if (!err) {
                        const from = event.args.from
                        const to = event.args.to
                        const value = event.args.value

                        self.helpers().addTransaction(from, to, value.toString())
                    }
                })
            }
        }
    }

    web3Getters = () => {
        const self = this
        return {
            dbetBalance: () => {
                console.log('dbetBalance', helper.getWeb3().eth.defaultAccount.address)
                helper.getContractHelper().getWrappers().token()
                    .balanceOf(helper.getWeb3().eth.defaultAccount.address).then((balance) => {
                    console.log('dbetBalance', balance.toString())
                    self.setState({
                        balance: balance.toString()
                    })
                }).catch((err) => {
                    console.log('dbetBalance err', err.message)
                })
            }
        }
    }

    helpers = () => {
        const self = this
        return {
            addTransaction: (from, to, value) => {
                const transactions = self.state.transactions
                transactions.push({
                    from: from,
                    to: to,
                    value: value
                })
                self.setState({
                    transactions: transactions
                })
            }
        }
    }

    views = () => {
        const self = this
        return {
            address: () => {
                return <div className="col-12 mt-lg-0 col-lg-4 hvr-float">
                    <Card style={styles.card} className="stat-card">
                        <div className="container">
                            <p>{self.state.address}</p>
                        </div>
                    </Card>
                </div>
            },
            network: () => {
                return <div className="col-12 mt-4 mt-lg-0 col-lg-4 hvr-float">
                    <Card style={styles.card} className="stat-card">
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <h3>NETWORK</h3>
                                    {this.state.ethNetwork === constants.ETHEREUM_NETWORK_LOADING &&
                                    <DropDownMenu
                                        value={this.state.ethNetwork}
                                        autoWidth={false}
                                        style={{
                                            width: '100%'
                                        }}
                                        onChange={() => {

                                        }}>
                                        <MenuItem value={constants.ETHEREUM_NETWORK_LOADING} primaryText="Loading.."/>
                                    </DropDownMenu>
                                    }
                                    {this.state.ethNetwork !== constants.ETHEREUM_NETWORK_LOADING &&
                                    <DropDownMenu
                                        value={self.state.ethNetwork}
                                        autoWidth={false}
                                        style={{
                                            width: '100%'
                                        }}
                                        onChange={(event, key, value) => {
                                            if (parseInt(value) <= parseInt(constants.ETHEREUM_NETWORK_KOVAN)) {
                                                helper.getContractHelper()
                                                    .resetWeb3(helper.getEthereumProvider(value))
                                                self.setState({
                                                    ethNetwork: value
                                                })
                                            }
                                        }}>
                                        {constants.AVAILABLE_ETHEREUM_NETWORKS.map((network) =>
                                            <MenuItem
                                                value={network}
                                                primaryText={helper.getEthereumNetwork(network)}
                                            />
                                        )}
                                    </DropDownMenu>
                                    }
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            },
            dbetBalance: () => {
                return <div className="float-right">
                    {self.state.balance} <img src="/assets/img/icons/Decent_bet.Icon_white_small.png"/>
                </div>
            },
            transactions: () => {
                const getStripedStyle = (index) => {
                    return {background: index % 2 ? '#212732' : '#171a21'}
                }
                const isReceive = (tx) => {
                    // If to === logged in address, it's a receive, otherwise it's a send
                    return tx.to === helper.getWeb3().eth.defaultAccount.address
                }
                const getPrimaryText = (tx) => {
                    return (isReceive(tx) ? 'Received' : 'Sent') + ' DBET'
                }
                const getIcon = (tx) => {
                    return isReceive(tx) ? <i className="fa fa-arrow-circle-o-down"></i> :
                        <i className="fa fa-paper-plane"></i>;
                }

                return <div className="col transactions">
                    <div className="col">
                        {self.state.transactions.length == 0 &&
                        <p className="mt-4 text-center no-transactions">
                            No Transactions
                        </p>
                        }
                        {self.state.transactions.length > 0 &&
                        <div className="table-responsive mt-4">
                            <List>
                                {self.state.transactions.map((tx, index) =>
                                    <ListItem
                                        leftAvatar={getIcon(tx)}
                                        rightAvatar={<span>{tx.value}</span>}
                                        primaryText={getPrimaryText(tx)}
                                        secondaryText={tx.date.toLocaleDateString()}
                                        style={{color: '#fff'}}
                                        innerDivStyle={getStripedStyle(index)}
                                    />
                                )}
                            </List>
                        </div>
                        }
                    </div>
                </div>
            }
        }
    }

    render() {
        const self = this
        return (
            <div className="wallet">
                <div className="container">
                    <div className="row">
                        {self.views().dbetBalance()}
                    </div>
                    <div className="row mt-4">
                        <RaisedButton
                            label={<span><i className="fa fa-paper-plane"></i> Send DBET</span>}
                            fullWidth={true}
                            backgroundColor={constants.COLOR_GOLD}
                            /** To get rid of unnecessary white edges caused by white background under rounded borders */
                            style={{
                                backgroundColor: constants.COLOR_GOLD
                            }}
                            labelStyle={styles.button.label}
                        />
                        {self.views().transactions()}
                    </div>
                </div>
            </div>
        )
    }

}

export default Wallet