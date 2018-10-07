

import { Subscription, interval, from, of } from 'rxjs'
import { flatMap, switchMap } from 'rxjs/operators'
const LISTENER_INTERVAL = 3000

export default class BalanceListener {
    private _subscriptions$: Subscription[] = []
    private _web3DefaultAccount: string
    private _thorDefaultAccount: string

     constructor() {
        this._thorDefaultAccount = (window as any).thor.eth.defaultAccount
        this._web3DefaultAccount = (window as any).web3Object.eth.defaultAccount
    }

    public onVHTOBalanceChange(listener: (balance: number) => void): BalanceListener {
        this.createBalanceSubscription((window as any).thor.eth.getEnergy(
            this._thorDefaultAccount
        ), listener)
        return this
    }

    public onEthBalanceChange(listener: (balance: number) => void): BalanceListener {

        this.createBalanceSubscription((window as any).web3Object.eth.getBalance(this._web3DefaultAccount),
        listener)
        return this
    }

    public stop(): void {
        this._subscriptions$.forEach(sub$ => sub$.unsubscribe())
    }

    private createBalanceSubscription(
        promise: Promise<any>,
        listener: (balance: number) => void
    ) {
        const subscription$ = interval(LISTENER_INTERVAL).pipe(
            flatMap(() => from(promise)),
            switchMap(i => of(i))
        ).subscribe(balance => {
            console.log(`----------listenForBalance:`, balance)
            listener(balance)
        })

        this._subscriptions$.push(subscription$)
    }

}