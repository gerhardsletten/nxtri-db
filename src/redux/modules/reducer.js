import {combineReducers} from 'redux'
import {routerReducer} from 'react-router-redux'
import {reducer as reduxAsyncConnect} from 'redux-connect'

import results from './results'
import auth from './auth'

export default combineReducers({
  routing: routerReducer,
  reduxAsyncConnect,
  results,
  auth
})
