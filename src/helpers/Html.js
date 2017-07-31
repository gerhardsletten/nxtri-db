import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom/server'
import serialize from 'serialize-javascript'
import Helmet from 'react-helmet'
import { ServerStyleSheet } from 'styled-components'

export default class Html extends Component {
  static propTypes = {
    assets: PropTypes.object,
    component: PropTypes.node,
    store: PropTypes.object
  }

  render () {
    const {assets, component, store} = this.props
    const content = component ? ReactDOM.renderToString(component) : ''
    const head = Helmet.rewind()
    const sheet = new ServerStyleSheet()
    sheet.collectStyles(component)
    const styleTags = sheet.getStyleElement()
    return (
      <html lang='en-us'>
        <head>
          {head.base.toComponent()}
          {head.title.toComponent()}
          {head.meta.toComponent()}
          {head.link.toComponent()}
          {head.script.toComponent()}

          <link rel='shortcut icon' href='/favicon.ico' />
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          {styleTags}
        </head>
        <body>
          <div id='content' dangerouslySetInnerHTML={{__html: content}} />
          <script dangerouslySetInnerHTML={{__html: `window.__data=${serialize(store.getState())}`}} charSet='UTF-8' />
          <script async src={assets.javascript.main} charSet='UTF-8' />
        </body>
      </html>
    )
  }
}
