const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const HomepageController = require('../controllers/homeController')

router.route('/')
.get(catchAsync(HomepageController.Homepage))





module.exports = router;