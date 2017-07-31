import equal from 'deep-equal'

const LOAD = 'app/results/LOAD'
const LOAD_SUCCESS = 'app/results/LOAD_SUCCESS'
const LOAD_FAIL = 'app/results/LOAD_FAIL'

const initialState = {
  loaded: false,
  params: {},
  data: {}
}

export default function reducer (state = initialState, action = {}) {
  switch (action.type) {
    case LOAD:
      return {
        ...state,
        loading: true
      }
    case LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        data: action.payload,
        params: action.params
      }
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: false,
        error: action.error
      }
    default:
      return state
  }
}

export function isLoaded (globalState, params = {}) {
  return globalState.results && globalState.results.loaded && equal(globalState.results.params, params)
}

export function load (params = {}) {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/results', {
      params
    }),
    params
  }
}
