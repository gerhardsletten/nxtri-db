require('babel-polyfill')

const environment = {
  development: {
    isProduction: false
  },
  production: {
    isProduction: true
  }
}[process.env.NODE_ENV || 'development']

module.exports = Object.assign({
  host: process.env.HOST || 'localhost',
  port: process.env.PORT,
  apiHost: process.env.APIHOST || 'localhost',
  apiPort: process.env.APIPORT,
  dbHost: process.env.DB_HOST,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  apiTimeout: 3000,
  sessionSecret: process.env.SESSION_SECRET || 'supersecret',
  sessionTimeoutDays: process.env.SESSION_TIMEOUT || 7,
  tokenSecret: process.env.TOKEN_SECRET || 'supersecret',
  username: process.env.USERNAME || 'admin',
  password: process.env.PASSWORD || 'secret',
  app: {
    title: '',
    description: '',
    head: {
      titleTemplate: '%s',
      meta: [
        {charset: 'utf-8'}
      ]
    }
  }
}, environment)
