const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')

// const{isLoggedIn} = require('../middleware')
const programari = require('../models/programari')
const programariController = require('../controllers/ProgramariController')


const{isLoggedIn} = require('../middleware')
const {AppointmentSchema} = require('../schemas')
const validateAppointment= (req,res,next)=>{
    const{error} = AppointmentSchema.validate(req.body);
    if(error){
       const msg = error.details.map(el=>el.message).join(',')
       throw new ExpressError(msg, 400)
    }else{
       next();
    }
 }

router.route('/programare')
.post(validateAppointment, catchAsync(programariController.ProgramareSubmitRequest))



module.exports =router;