export const mockClear = jest.fn()
const mock = jest.fn().mockImplementation(() => ({
    clear: mockClear
}))

export default mock