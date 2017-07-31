const LOAD = 'app/auth/LOAD'
const LOAD_SUCCESS = 'app/auth/LOAD_SUCCESS'
const LOAD_FAIL = 'app/auth/LOAD_FAIL'
const LOGIN = 'app/auth/LOGIN'
const LOGIN_SUCCESS = 'app/auth/LOGIN_SUCCESS'
const LOGIN_FAIL = 'app/auth/LOGIN_FAIL'
const LOGOUT = 'app/auth/LOGOUT'
const LOGOUT_SUCCESS = 'app/auth/LOGOUT_SUCCESS'
const LOGOUT_FAIL = 'app/auth/LOGOUT_FAIL'

const initialState = {
  loaded: false
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
        data: action.payload
      }
    case LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loaded: true,
        error: action.error
      }
    case LOGIN:
      return {
        ...state,
        loggingIn: true
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        loggingIn: false,
        data: action.payload
      }
    case LOGIN_FAIL:
      return {
        ...state,
        loggingIn: false,
        data: null,
        error: action.error
      }
    case LOGOUT:
      return {
        ...state,
        loggingOut: true
      }
    case LOGOUT_SUCCESS:
      return {
        ...state,
        loggingOut: false,
        data: null
      }
    case LOGOUT_FAIL:
      return {
        ...state,
        loggingOut: false,
        error: action.error
      }
    default:
      return state
  }
}

export function isLoaded (globalState) {
  return globalState.auth && globalState.auth.loaded
}

export function isAuthenticated (globalState) {
  return globalState.auth && globalState.auth.data
}

export function load () {
  return {
    types: [LOAD, LOAD_SUCCESS, LOAD_FAIL],
    promise: (client) => client.get('/user/load')
  }
}

export function login (username, password) {
  return {
    types: [LOGIN, LOGIN_SUCCESS, LOGIN_FAIL],
    promise: (client) => client.post('/user/login', {
      data: {
        username: username,
        password: password
      }
    })
  }
}

export function logout () {
  return {
    types: [LOGOUT, LOGOUT_SUCCESS, LOGOUT_FAIL],
    promise: (client) => client.post('/user/logout')
  }
}
