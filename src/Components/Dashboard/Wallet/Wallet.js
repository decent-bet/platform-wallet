/**
 * Created by user on 9/11/2017.
 */

import React, {Component} from 'react'

import Card from 'material-ui/Card'

import Helper from '../../Helper'
const helper = new Helper()

import './wallet.css'

const styles = {
    card: {
        padding: 20,
        borderRadius: 8
    }
}

class Wallet extends Component {

    constructor(props) {
        super(props)
        this.state = {
            ethNetwork: 0,
            balance: 0,
            address: helper.getWeb3().eth.defaultAccount
        }
    }

    componentWillMount = () => {
        this.initData()
    }

    initData = () => {
        this.web3Getters().ethereumNetwork()
        this.web3Getters().dbetBalance()
    }

    web3Getters = () => {
        const self = this
        return {
            ethereumNetwork: () => {
                console.log(helper.getWeb3().version.network)
                helper.getWeb3().version.getNetwork((err, netId) => {
                    self.setState({
                        ethNetwork: netId
                    })
                })
            },
            dbetBalance: () => {
                helper.getContractHelper().getWrappers().token()
                    .balanceOf(helper.getWeb3().eth.defaultAccount).then((balance) => {
                    self.setState({
                        balance: balance.toString()
                    })
                })
            }
        }
    }

    helpers = () => {
        const self = this
        return {
            getEthereumNetwork: () => {
                switch (this.state.ethNetwork) {
                    case "0":
                        return "Loading.."
                    case "1":
                        return 'Ethereum Mainnet'
                    case "2":
                        return 'Morden test network'
                    case "3":
                        return 'Ropsten test network'
                    default:
                        return 'Private test network'
                }
            }
        }
    }

    views = () => {
        const self = this
        return {
            address: () => {
                return <div className="col-4">
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
                return <div className="col-4">
                    <Card style={styles.card} className="stat-card">
                        <div className="container">
                            <div className="row">
                                <div className="col">
                                    <h3>NETWORK</h3>
                                    <p>{ self.helpers().getEthereumNetwork() }</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            },
            dbetBalance: () => {
                return <div className="col-4">
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
                </div>
            </div>
        )
    }

}

export default Wallet