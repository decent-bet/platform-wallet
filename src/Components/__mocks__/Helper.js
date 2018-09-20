export const mockOpenUrl = jest.fn()
export const mockFormatAddress = jest.fn()
export const mockFormatNumber = jest.fn()
export const mockFormatDbets = jest.fn()

const mock = jest.fn().mockImplementation(() => ({
    formatAddress: mockFormatAddress,
    formatNumber: mockFormatNumber,
    formatDbets: mockFormatDbets,
    openUrl: mockOpenUrl,
}))

export default mock