import React from 'react'
import {Route, IndexRoute} from 'react-router'
import {isLoaded as isAuthLoaded, load as loadAuth} from './redux/modules/auth'
import {
  App,
  Home,
  Results,
  Secret,
  Login,
  NotFound
} from 'containers'

export const routes = {
  home: '/',
  results: '/results',
  secret: '/secret',
  login: '/login'
}

export default (store) => {
  const requireLogin = (nextState, replace, cb) => {
    function checkAuth () {
      const {auth: { data: user }} = store.getState()
      if (!user) {
        replace(routes.login)
      }
      cb()
    }

    if (!isAuthLoaded(store.getState())) {
      store.dispatch(loadAuth()).then(checkAuth)
    } else {
      checkAuth()
    }
  }

  return (
    <Route path={routes.home} component={App}>
      <IndexRoute component={Home} />
      <Route path={routes.results} component={Results} />
      <Route onEnter={requireLogin}>
        <Route path={routes.secret} component={Secret} />
      </Route>
      <Route path={routes.login} component={Login} />
      <Route path='*' component={NotFound} status={404} />
    </Route>
  )
}
