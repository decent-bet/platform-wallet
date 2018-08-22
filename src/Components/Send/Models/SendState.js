export function SendState(address, selectedTokenContract) {
    return {
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
            }
        },
        ethBalance: null,
        selectedTokenContract: selectedTokenContract,
        address,
        enteredValue: '0',
        dialogs: {
            error: {
                open: false,
                title: '',
                message: ''
            },
            transactionConfirmation: {
                open: false,
                key: null
            },
            password: {
                open: false
            }
        },
        snackbar: {
            message: '',
            open: false
        }
    }
}
