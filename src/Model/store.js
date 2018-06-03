import {createStore, applyMiddleware, combineReducers} from 'redux'
import promiseMiddleware from 'redux-promise-middleware'
import thunkMiddleware from 'redux-thunk'
import logger from 'redux-logger'

import {Reducer as houseReducer} from './house'
import {Reducer as balanceReducer} from './balance'

// Combine all Reducers
const CombinedReducers = combineReducers({
    house: houseReducer,
    balance: balanceReducer
})

// Setup middleware
const middleware = [
    thunkMiddleware,
    promiseMiddleware({promiseTypeDelimiter: '/'})
]

middleware.push(logger)

export default createStore(CombinedReducers, {}, applyMiddleware(...middleware))
