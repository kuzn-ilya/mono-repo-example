'use strict'

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./cjs/foobar.production.min.js')
} else {
  module.exports = require('./cjs/foobar.development.js')
}
