import { Subscription, timer, from, zip, Observable } from 'rxjs'
import { map, switchMap } from 'rxjs/operators'

const LISTENER_INTERVAL = 8000

export type ListenerParam = (
    result: { vthoBalance: number; ethBalance: number; updatedAt: Date }
) => void

export default class BalanceListener {
    private _subscription$: Subscription

    constructor(private thor: any) {}

    public onBalancesChange(listener: ListenerParam): BalanceListener {
        this.stop()
        this._subscription$ = this.createBalanceSubscription().subscribe(
            listener
        )
        return this
    }

    public stop(): void {
        if (this._subscription$) {
            this._subscription$.unsubscribe()
        }
    }

    private createBalanceSubscription(): Observable<any> {
        // Polling works best with RPC endpoint
        const thorDefaultAccount = this.thor.eth.defaultAccount

        return timer(0, LISTENER_INTERVAL).pipe(
            switchMap(() =>
                zip(from(this.thor.eth.getEnergy(thorDefaultAccount)))
            ),
            map(i => {
                return {
                    vthoBalance: i[0],
                    updatedAt: new Date()
                }
            })
        )
    }
}
