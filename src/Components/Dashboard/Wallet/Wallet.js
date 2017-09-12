/**
 * Created by user on 9/11/2017.
 */

import React, {Component} from 'react'

import Card from 'material-ui/Card'
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import Helper from '../../Helper'
const helper = new Helper()

const constants = require('../../Constants')

import './wallet.css'

const styles = {
    card: {
        padding: '20px 5px 20px 5px',
        borderRadius: 8,
        cursor: 'pointer',
        minHeight: 150
    }
}

class Wallet extends Component {

    constructor(props) {
        super(props)
        let ethNetwork = helper.getWeb3().version.network
        ethNetwork = ethNetwork <= parseInt(constants.ETHEREUM_NETWORK_KOVAN) ?
            ethNetwork : constants.ETHEREUM_NETWORK_LOCAL
        console.log('Address', helper.getWeb3().eth.defaultAccount.address)
        this.state = {
            ethNetwork: ethNetwork,
            balance: 0,
            address: helper.getWeb3().eth.defaultAccount.address,
            transactions: []
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
                console.log('dbetBalance')
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
                            <div className="row">
                                <div className="col">
                                    <h3>ADDRESS</h3>
                                    <p>{ self.state.address }</p>
                                </div>
                            </div>
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
                                    {   this.state.ethNetwork == 0 &&
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
                                    {   this.state.ethNetwork != 0 &&
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
                                        {   constants.AVAILABLE_ETHEREUM_NETWORKS.map((network) =>
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
                return <div className="col-12 mt-4 mt-lg-0 col-lg-4 hvr-float">
                    <Card style={styles.card} className="stat-card">
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <h3>BALANCE</h3>
                                    <p>{ self.state.balance } DBETs</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            },
            transactions: () => {
                return <div className="col">
                    <Card style={styles.card} className="transactions">
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <h3 className="text-center">TRANSACTIONS</h3>
                                    {   self.state.transactions.length == 0 &&
                                    <p className="mt-4 text-center no-transactions">
                                        No transactions have been made to/from your wallet
                                        yet..
                                    </p>
                                    }
                                    {   self.state.transactions.length > 0 &&
                                    <div className="table-responsive mt-4">
                                        <table className="table table-striped">
                                            <thead>
                                            <tr>
                                                <th>From</th>
                                                <th>To</th>
                                                <th>Amount</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {   self.state.transactions.map((tx) =>
                                                <tr>
                                                    <td>{ self.state.from }</td>
                                                    <td>{ self.state.to }</td>
                                                    <td>{ self.state.value }</td>
                                                </tr>
                                            )}
                                            </tbody>
                                        </table>
                                    </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </Card>
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
                        { self.views().address() }
                        { self.views().network() }
                        { self.views().dbetBalance() }
                    </div>
                    <div className="row mt-4">
                        { self.views().transactions() }
                    </div>
                </div>
            </div>
        )
    }

}

export default Wallet