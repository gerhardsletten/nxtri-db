import express from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import session from 'express-session'
import config from '../src/config'
import {Results, Auth} from './routes'

const app = express()

app.use(cookieParser())
app.use(bodyParser.json())
app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: (3600000 * 24 * config.sessionTimeoutDays) }
}))

var router = express.Router()

/* Results routes */
router.route('/results').get(Results.read)

/* User routes */
router.route('/user/login').post(Auth.login)
router.route('/user/logout').post(Auth.logout)
router.route('/user/load').get(Auth.loadAuth)

app.use(router)

if (config.apiPort) {
  app.listen(config.apiPort, (err) => {
    if (err) {
      console.error(err)
    }
    console.info('----\n==> 🌎  API is running on port %s', config.apiPort)
    console.info('==> 💻  Send requests to http://%s:%s', config.apiHost, config.apiPort)
  })
} else {
  console.error('==> ERROR: No PORT environment variable has been specified')
}

process.on('unhandledRejection', error => {
  console.log('unhandledRejection api', error)
})