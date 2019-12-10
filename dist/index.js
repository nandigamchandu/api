
'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./devfractal-api.cjs.production.min.js')
} else {
  module.exports = require('./devfractal-api.cjs.development.js')
}
