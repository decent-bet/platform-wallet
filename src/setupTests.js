import 'raf/polyfill'
import Enzyme, { shallow, render, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

// React 16 Enzyme adapter
Enzyme.configure({ adapter: new Adapter() })

// Make Enzyme functions available in all test files without importing
global.shallow = shallow
global.render = render
global.mount = mount
global.window.web3Object = {
    eth: {
        defaultAccount: '0x9b0c989C166981412a321381d733435eA64EBE10',
        getBalance: (address, callback) => {
            callback(null, 0)
        }
    },
    fromWei: () => 0,
    toWei: () => 0,
    toBigNumber: () => ({
        times: () => {
            const c = 0
            c.times = () => 0
            return c
        }
    })
}
global.window.matchMedia = () => ({

})