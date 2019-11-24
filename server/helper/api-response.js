const httpStatus = require('http-status')
const APIError = require('./api-error')

class APIReponse {
  success (res, result) {
    return res.status(httpStatus.OK).json(result)
  }

  error (res, err) {
    if (err instanceof APIError) {
      /** Detech httpStatus in api error */
      let code = httpStatus.INTERNAL_SERVER_ERROR
      if (typeof err.status === 'number') {
        code = err.status
      } else if (typeof httpStatus[err.status] === 'number') {
        code = httpStatus[err.status]
      }
      return res.status(code).json({
        error: err.message
      })
    }

    /** Handle for normal error */
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      error: err.message || err
    })
  }
}

module.exports = new APIReponse()
