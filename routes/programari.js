const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')

// const{isLoggedIn} = require('../middleware')
const programari = require('../models/programari')
const programariController = require('../controllers/ProgramariController')


router.route('/programare')
.post( catchAsync(programariController.ProgramareSubmitRequest))



module.exports =router;