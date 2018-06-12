import React from 'react'
import { shallowWithIntl } from '../../../i18n/enzymeHelper'
import KeyHandler, {mockClear} from '../../Base/KeyHandler'
jest.mock('../../Base/KeyHandler')

let module
describe('Components/App/LogoutRoute', function () {
    beforeEach(() => {
        module = require('../LogoutRoute').default
    })
    it('should export function', function () {
        expect(module).toBeInstanceOf(Function)
    })
    it.skip('should render without error', function () { //TODO: figure out constructor/call for Route render
        const wrapperConstructor = module({component: React.component})
        const wrapper = shallowWithIntl(<wrapperConstructor/>)
        expect(wrapper.find('Route').length).toBe(1)
    })
})