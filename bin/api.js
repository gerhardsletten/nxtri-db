#!/usr/bin/env node
if (process.env.NODE_ENV !== 'production') {
  if (!require('piping')({
    hook: true,
    usePolling: true,
    interval: 1000,
    ignore: /(\/\.|~$|\.json$)/i})) {
    return
  }
}
require('../server.babel')
require('../api/api')
