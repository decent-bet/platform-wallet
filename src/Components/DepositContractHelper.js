const Contract_DBETToVETDeposit = require('./Base/Contracts/DBETToVETDeposit.json')
const Contract_DBETVETToken = require('./Base/Contracts/DBETVETToken.json')
import { from, fromEvent } from 'rxjs'

export class DepositContractHelper {
    constructor(thor) {
        this.web3 = thor
        
        this.receptionContract = new thor.eth.Contract(
            Contract_DBETToVETDeposit.abi,
            process.env.RECEIVER_CONTRACT_ADDRESS || '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'
        )
        this.senderContract = new thor.eth.Contract(
            Contract_DBETVETToken.abi,
            process.env.SENDER_CONTRACT_ADDRESS || '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'
        )
    }

    listen() {
        // Start the subscription to the event
        const logTokenDeposit$ = fromEvent(this.receptionContract.events.LogTokenDeposit({
            fromBlock: 0
        }))
        const unsubscribe = logTokenDeposit$.subscribe(i => {
            console.log(i)
        })
        // // Listen for received events from the contract
        // eventListener.on('data', console.log)
        // eventListener.on('changed', console.log)
        // eventListener.on('error', console.log)

        // const receiverContractInterface = new DBETVETTokenContract()

        // Listen for new Block Headers
        // const listener = window.web3.eth.subscribe(
        //     'newBlockHeaders'
        // )
        // const blockHeader$ = fromEvent(listener)
        // blockHeaderSubscription.on('data', blockHeader =>
        //     receiverContractInterface.process(blockHeader.number)
        // )
        // blockHeaderSubscription.on('error', error => logger.error(error))

        // // Sender Contract Listeners
        // const senderContractSubscription = this.senderContract.events.LogGrantTokens(
        //     {
        //         fromBlock: 0
        //     }
        // )
        // senderContractSubscription.on(
        //     'data',
        //     listeners.grantTokensEventReceived
        // )
        // senderContractSubscription.on('error', error => logger.error(error))

        // return eventListener
    }
}
