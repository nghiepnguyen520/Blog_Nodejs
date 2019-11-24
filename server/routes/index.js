const express = require('express')
const fs = require('fs')

const router = express.Router()

/** GET /health-check - Check service health */
router.get('/health-check', (req, res) => {
  res.send('OK')
})

/** Load all routes in routes folder */
const load = () => {
  const routeList = fs.readdirSync(__dirname)
  routeList.filter(r => r.endsWith('.route.js')).forEach((file) => {
    const route = require(`./${file}`) // eslint-disable-line global-require
    const name = file.split('.')[0]
    router.use(`/${name}`, route)
  })
  return router
}

module.exports = load()
