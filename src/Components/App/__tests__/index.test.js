// TODO: fix Cannot find module './build/Release/scrypt' from 'index.js'
let wrapper
describe.skip('Components/App/index', function () {
    beforeEach(() => {
        wrapper = require('../index').default
    })
    it('should export App.jsx', function () {
        expect(wrapper).toBe(require('../App').default)
    })
})