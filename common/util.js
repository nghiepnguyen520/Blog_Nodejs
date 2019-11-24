const _ = require('lodash')
const fs = require('fs')
const crypto = require('crypto')

const constant = require('./contant')

const phoneNumberRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/
// eslint-disable-next-line no-useless-escape
const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
const axios = require('axios')

const CALL_API_TIMEOUT = 30000
const CancelToken = axios.CancelToken
const source = CancelToken.source()

class Util {
  traceError (error) {
    if (error instanceof Error) {
      logger.error(error.stack)
      return
    }
    logger.error(error)
  }

  paginate (result, page, offset, extra = {}) {
    return {
      totalRecord: result.count,
      totalPage: Math.ceil(result.count / offset),
      page,
      data: result.rows,
      ...extra
    }
  }

  collectError (details) {
    return _
      .uniqBy(details, 'context.key')
      .map(e => ({
        field: e.context.key,
        value: e.context.value,
        message: e.message
      }))
  }

  createFolder (location) {
    const folders = location.split('/')
    let destination = `${folders[0]}`
    if (folders.length > 2) {
      for (let i = 1; i < folders.length; i++) {
        destination += `/${folders[i]}`
        if (!fs.existsSync(destination)) {
          fs.mkdirSync(destination)
        }
      }
    }
  }

  calculateFinalResult (theory, practice) {
    if (_.isNaN(+theory) || _.isNaN(+practice)) {
      throw new Error(`Util::calculateFinalResult: theory: ${theory} or practice: ${practice} is not a number`)
    }
    const averageMark = (theory + practice) / 2
    let level
    if (averageMark >= 8) level = constant.FINAL_RESULT_LEVEL.EXCELLENT
    else if (averageMark >= 6) level = constant.FINAL_RESULT_LEVEL.GOOD
    else if (averageMark >= 5) level = constant.FINAL_RESULT_LEVEL.AVERAGE
    else level = constant.FINAL_RESULT_LEVEL.FAILED
    return level
  }

  isEmail (input) {
    return emailRegex.test(input)
  }

  isValidPhoneNumber (input) {
    return phoneNumberRegex.test(input)
  }

  generateUsername (email) {
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format to generate username')
    }
    const [prefix] = email.split('@')
    let sail = ''
    for (let i = 0; i < 20; i++) {
      sail += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    const hash = crypto.createHash('md5').update(sail).digest('hex')

    return `${prefix}${hash.substr(0, 4)}`
  }

  calcualteTotalCost (course) {
    if (!course) return null
    const {
      type_cost: method, price = 0, total_sessions: totalSessions = 0
    } = course
    const amount = method === constant.COURSE_TYPE_COST.BY_COURSE ? 1 : totalSessions
    return price * amount
  }

  async fetch ({ url, headers, ...options }) {
    return axios({
      method: 'GET',
      timeout: CALL_API_TIMEOUT,
      url,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      ...options
    }, {
      cancelToken: source.token
    }).then((response) => {
      return response
    }).catch(error => {
      if (axios.isCancel(error)) {
        console.log('Request canceled', error.message)
      } else {
        throw error
      }
    })
  }
}

module.exports = new Util()
