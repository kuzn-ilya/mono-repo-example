'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/foo.production.min.js')
} else {
  module.exports = require('./cjs/foo.development.js')
}
