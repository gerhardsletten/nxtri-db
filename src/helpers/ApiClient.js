import superagent from 'superagent'
import config from 'config'

const methods = ['get', 'post', 'put', 'patch', 'del']

function formatUrl (path) {
  const adjustedPath = path[0] !== '/' ? '/' + path : path
  if (__SERVER__) {
    // Prepend host and port of the API server to the path.
    return 'http://' + config.apiHost + ':' + config.apiPort + adjustedPath
  }
  // Prepend `/api` to relative URL, to proxy to API server.
  return '/api' + adjustedPath
}

export default class ApiClient {
  constructor (req) {
    methods.forEach((method) => {
      this[method] = (path, { params, data } = {}) => new Promise((resolve, reject) => {
        const request = superagent[method](formatUrl(path))
        request.timeout(config.apiTimeout)

        if (params) {
          request.query(params)
        }

        if (__SERVER__ && req.get('cookie')) {
          request.set('cookie', req.get('cookie'))
        }

        if (data) {
          request.send(data)
        }

        request.end((err, { body } = {}) => {
          if (err && err.timeout) {
            return reject(new Error(`Loading ${path} timeout`))
          }
          err ? reject((body && body.error) ? body.error : body || err) : resolve(body)
        })
      })
    })
  }
  empty () {}
}
