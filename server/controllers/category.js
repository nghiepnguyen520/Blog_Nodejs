const Category = require('../../models').Category
const httpStatus = require('http-status')
const Joi = require('@hapi/joi')
const { APIError, apiResponse } = require('../helper')
const { constant, util } = require('../../common')
module.exports = {
  create (res, req, next) {
    const schema = Joi.object().keys({
      name: Joi.string().required()
    })
    const validater = Joi.validate(req.query, schema, { abortEarly: false })
    if (validater.error) return next(new APIError(util.collectError(validater.error.details), httpStatus.BAD_REQUEST))
    const {
      fields
    } = validater.value
    const resultCategory = Category.create({ ...fields })
    return apiResponse.success(res, resultCategory)
  }
}
