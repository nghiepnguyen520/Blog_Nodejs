const categotyController = require('../controllers').category
const express = require('express')
const router = express.Router()

router.route('/')
/** Get /api/enquiry - Get list enquiries with pagination */
  // .get(categotyController.)
  .post(categotyController.create)

module.exports = router
