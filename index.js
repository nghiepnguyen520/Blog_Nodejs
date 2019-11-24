require('dotenv').config()
const express = require('express')
const logger = require('morgan')
const bodyParser = require('body-parser')
const http = require('http')
/** Route */
const router = require('./server/routes')
const app = express()
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (req, res) => res.status(200).send({
  message: 'Welcome suggar'
}))
/** Model */
var model = require('./models')
model.sequelize.sync().then(function () {
  console.log('Nice, DATABASE OKE')
}).catch(function (err) {
  console.err(err, 'database not oke')
})
app.use('/api', router)
const port = process.env.PORT || 8000
app.set('port', port)
const server = http.createServer(app)
server.listen(port)
module.exports = app
