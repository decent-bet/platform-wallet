export const mockOpenUrl = jest.fn()
export const mockFormatAddress = jest.fn()
export const mockFormatNumber = jest.fn()
export const mockFormatDbets = jest.fn()

const mock = jest.fn().mockImplementation(() => ({
    openUrl: mockOpenUrl,
    formatAddress: mockFormatAddress,
    formatNumber: mockFormatNumber,
    formatDbets: mockFormatDbets
}))

export default mock