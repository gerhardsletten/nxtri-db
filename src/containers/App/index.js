import React, {Component} from 'react'
import styled, {injectGlobal, ThemeProvider} from 'styled-components'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {asyncConnect} from 'redux-connect'
import {push} from 'react-router-redux'
import {Link} from 'react-router'

import {isLoaded as isAuthLoaded, load as loadAuth, logout} from '../../redux/modules/auth'
import {routes} from 'routes'

const theme = {
  primary: 'red',
  link: 'blue'
}

injectGlobal`
  * {
    font-family: Menlo, Monaco, "Lucida Console", "Liberation Mono", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Courier New", monospace, serif;
    margin: 0;
    padding: 0;
  }
  body {
    margin: 0;
    padding: 0;
    min-height: 100vh;
  }
`

const Wrapper = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  flex-direction: column;
`

const Main = styled.main`
  flex: 1;
  padding: 1rem;
`

const Footer = styled.footer`
  background: #ccc;
  padding: 1rem;
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
        <Wrapper>
          {user && (
            <nav>
              <Link to={routes.home}>Home</Link>
              <Link to={routes.results}>Maps</Link>
              <Link to={routes.secret}>Secret</Link>
              <span>Logged in as {user.username}</span>
              <button onClick={this.handleLogout}>Logout</button>
            </nav>
          )}
          <Main>
            {this.props.children}
          </Main>
          <Footer>
            lorem ipusm
            {!user && <Link to={routes.login}>Login</Link>}
          </Footer>
        </Wrapper>
      </ThemeProvider>
    )
  }
}
