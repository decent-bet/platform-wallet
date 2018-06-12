const getHelperFns = jest.fn(() => ({
    openUrl: jest.fn(getHelperFns),
    formatAddress: jest.fn(getHelperFns),
    formatNumber: jest.fn(getHelperFns),
    formatDbets: jest.fn(getHelperFns),
    getContractHelper: jest.fn(getHelperFns),
    getWrappers: () => ({
        house: () => ({
                logPurchasedCredits: () => ({
                    watch: jest.fn(),
                    stopWatching: jest.fn()
                })
            }
        )
    })
}))

const mock = jest.fn(() => ({
    openUrl: getHelperFns,
    formatAddress: getHelperFns,
    formatNumber: getHelperFns,
    formatDbets: getHelperFns,
    getContractHelper: getHelperFns,
    getHouse: getHelperFns,
    getGetWrappers: getHelperFns
}))

export default mock