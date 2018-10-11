

import { Subscription, timer, from, zip, Observable } from 'rxjs'
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

        // Polling works best with RPC endpoint
        const web3Http = (window  as any).web3Http
        const web3DefaultAccount = this.web3.eth.defaultAccount
        const thorDefaultAccount = this.thor.eth.defaultAccount
 
        return timer(0, LISTENER_INTERVAL).pipe(
                 switchMap(() => zip(
                    from(this.thor.eth.getEnergy(thorDefaultAccount)),
                    from(web3Http.eth.getBalance(web3DefaultAccount))
                     )),
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