const express = require('express');
const router = express.Router({mergeParams:true});
//controllers
const piesaController = require('../controllers/pieseController.js')


const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError.js')

const Car = require('../models/cars.js')
const piesa = require('../models/piese.js')

const{CarSchema,PiesaSchema} =  require('../schemas.js')
const {isLoggedIn} = require('../middleware.js');

module.exports.validatePiesa = (req,res,next)=>{
    const{error} = PiesaSchema.validate(req.body);
    if(error){
       const msg = error.details.map(el=>el.message).join(',')
       throw new ExpressError(msg, 400)
    }else{
       next();
    }
 }


router.post('/', isLoggedIn, catchAsync(piesaController.createPiesa))

router.route('/:piesaId')
.put(isLoggedIn, catchAsync(piesaController.updatePiesa))
.delete( isLoggedIn, catchAsync(piesaController.deletePiesa))

router.get('/:piesaId/edit', isLoggedIn, catchAsync(piesaController.renderEditPiesaPage))

module.exports = router;