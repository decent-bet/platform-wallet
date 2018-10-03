export function WalletState(selectedTokenContract) {
    return {
        swapDepositGasCost: 0,
        balances: {
            oldToken: {
                loading: true,
                amount: 0
            },
            newToken: {
                loading: true,
                amount: 0
            },
            newVETToken: {
                loading: true,
                amount: 0
            },
            eth: {
                loading: true,
                amount: 0
            },
            vet: {
                loading: true,
                amount: 0
            }
        },
        selectedTokenContract,
        address: '',
        transactions: {
            loading: {
                from: true,
                to: true
            },
            pending: {},
            confirmed: {}
        },
        dialogs: {
            upgrade: {
                learnMore: {
                    open: false
                },
                tokenUpgrade: {
                    open: false,
                    key: null
                }
            },
            upgradeToVET: {
                timeElapsed: 0,
                status: '',
                snackbar: {
                    open: false
                },                
                learnMore: {
                    open: false
                },
                tokenUpgrade: {
                    open: false,
                    key: null
                }
            },
            error: {
                open: false
            },
            password: {
                open: false
            }
        }
    }
}
