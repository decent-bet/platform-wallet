export const mockOpenUrl = jest.fn()
export const mockFormatAddress = jest.fn()
export const mockFormatNumber = jest.fn()
export const mockFormatDbets = jest.fn()
export const mockGetContractHelper = jest.fn()
export const mockHouse = jest.fn()
export const mockGetWrappers = jest.fn()

const mock = jest.fn().mockImplementation(() => ({
    openUrl: mockOpenUrl,
    formatAddress: mockFormatAddress,
    formatNumber: mockFormatNumber,
    formatDbets: mockFormatDbets,
    getContractHelper: mockGetContractHelper,
    getHouse: mockHouse,
    getGetWrappers: mockGetWrappers
}))

export default mock