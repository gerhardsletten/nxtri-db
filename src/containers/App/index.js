import React, {Component} from 'react'
import styled, {injectGlobal, ThemeProvider} from 'styled-components'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {asyncConnect} from 'redux-connect'
import {push} from 'react-router-redux'
import {Link} from 'react-router'
import {Provider} from 'rebass'

import {Wrapper, Main} from 'components'
import {isLoaded as isAuthLoaded, load as loadAuth, logout} from '../../redux/modules/auth'
import {routes} from 'routes'

const theme = {
  primary: 'red',
  link: 'blue'
}
const rebassTheme = {
  font: '"Avenir Next", Helvetica, sans-serif',
  fontSizes: [
    12, 16, 24, 36, 48, 72
  ]
}

injectGlobal`
  * {
    font-family: "Avenir Next", Helvetica, sans-serif;
    margin: 0;
    padding: 0;
    color: inherit;
    font-size: inherit;
    font-weight: 300;
  }
  html {
    font-size: 62.5%;
  }
  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
    background: #263238;
    color: #fff;
    font-size: 1.8rem;
  }
`

@asyncConnect([{
  promise: ({store: {dispatch, getState}}) => {
    const promises = []
    if (!isAuthLoaded(getState())) {
      promises.push(dispatch(loadAuth()))
    }
    return Promise.all(promises)
  }
}])
@connect(
  (state) => ({
    user: state.auth.data
  }),
  {
    push,
    logout
  }
)
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    push: PropTypes.func,
    logout: PropTypes.func
  }

  static contextTypes = {
    store: PropTypes.object.isRequired
  }

  handleLogout = (event) => {
    event.preventDefault()
    this.props.logout()
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.user && nextProps.user) {
      this.props.push(routes.secret)
    } else if (this.props.user && !nextProps.user) {
      this.props.push(routes.home)
    }
  }

  render () {
    const {user} = this.props
    return (
      <ThemeProvider theme={theme}>
        <Provider theme={rebassTheme}>
          <Wrapper>
            {user && (
              <nav>
                <Link to={routes.home}>Home</Link>
                <Link to={routes.results}>Results</Link>
                <Link to={routes.secret}>Secret</Link>
                <span>Logged in as {user.username}</span>
                <button onClick={this.handleLogout}>Logout</button>
              </nav>
            )}
            <Main>
              {this.props.children}
            </Main>
          </Wrapper>
        </Provider>
      </ThemeProvider>
    )
  }
}
