import ReactDOM from 'react-dom'
jest.mock('react-dom')
/* TODO: solve scrypt module resolution issue
Cannot find module './build/Release/scrypt' from 'index.js'
      at Resolver.resolveModule (node_modules/jest-resolve/build/index.js:169:17)
      at Object.<anonymous> (node_modules/scrypt/index.js:3:20)
* */
describe.skip('Index', function () {
    let wrapper;
    beforeEach(() =>{
        ReactDOM.render = jest.fn();
        wrapper = require('../index')
    })

    it('should render without throwing an error', function () {
        const r = new ReactDOM()
        expect(r.render).toHaveBeenCalled()
    })
})