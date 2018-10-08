

import { Subscription, interval, from, zip, Observable } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'

const LISTENER_INTERVAL = 8000

export type ListenerParam = (result: { vthoBalance: number, ethBalance: number, updatedAt: Date }) => void 

export default class BalanceListener {
    private _subscription$: Subscription

     constructor(private web3: any, 
                 private thor: any,) {}

    public onBalancesChange(listener: ListenerParam): BalanceListener {
        this.stop()
        this._subscription$ = this.createBalanceSubscription()
                                  .subscribe(listener)
        return this
    }

    public stop(): void {
        if(this._subscription$) {
            this._subscription$.unsubscribe()
        }
    }

    private createBalanceSubscription(): Observable<any> {

        const web3DefaultAccount = this.web3.eth.defaultAccount
        const thorDefaultAccount = this.thor.eth.defaultAccount

        const vtho$ = from(this.thor.eth.getEnergy(thorDefaultAccount))
        const eth$ = from(this.web3.eth.getBalance(web3DefaultAccount))
        
        return interval(LISTENER_INTERVAL).pipe(
                 map(() => zip(vtho$, eth$)),
                 switchMap(i => i),
                 map((i) => {
                     return {
                            vthoBalance: i[0],
                            ethBalance: i[1],
                         updatedAt: new Date()
                     }
                 })
                 )
    }

}