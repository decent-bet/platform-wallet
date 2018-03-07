export const mockEncrypt = jest.fn()
const mock = jest.fn().mockImplementation(() => ({
    AES: {
        encrypt: mockEncrypt
    }
}))

export default mock