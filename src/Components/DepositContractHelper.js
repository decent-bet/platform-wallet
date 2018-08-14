const Contract_DBETToVETDeposit = require('./Base/Contracts/DBETToVETDeposit.json')
const Contract_DBETVETToken = require('./Base/Contracts/DBETVETToken.json')
const constants = require('./Constants')
const network = 4
import { from, fromEvent } from 'rxjs'

export class DepositContractHelper {
    constructor(thor, web3) {
        this.thor = thor
        this.web3 = web3
        
        // eth
        this.receptionContract = new web3.eth.Contract(
            Contract_DBETToVETDeposit.abi,
            '0xD6cE9d299E1899B4BBCece03D2ad44b41212f324', //Contract_DBETToVETDeposit.networks[network].address,
        )

        // vet
        this.senderContract = new thor.eth.Contract(
            Contract_DBETVETToken.abi,
            constants.DBET_VET_CONTRACT
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
        // Listen for received events from the contract
        // eventListener.on('data', console.log)
        // eventListener.on('changed', console.log)
        // eventListener.on('error', console.log)

        // Sender Contract Listeners
        const senderContractSubscription = fromEvent(this.senderContract.events.LogGrantTokens(
            {
                fromBlock: 0
            }
        ))
        // senderContractSubscription.on(
        //     'data',
        //     listeners.grantTokensEventReceived
        // )
        // senderContractSubscription.on('error', error => logger.error(error))

        // Listen for new Block Headers
        const listener = this.web3.eth.subscribe(
            'newBlockHeaders'
        , (err, res) => console.log)
        // const blockHeader$ = fromEvent(listener)
        // // blockHeaderSubscription.on('data', blockHeader =>
        // //     receiverContractInterface.process(blockHeader.number)
        // // )
        // // blockHeaderSubscription.on('error', error => logger.error(error))

        // const unsubscribeBlockHeader =  blockHeader$.subscribe(i => {
        //     console.log(i)
        // })
    }
}
