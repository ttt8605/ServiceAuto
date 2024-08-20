const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')

const{isLoggedIn} = require('../middleware')
const Cars = require('../models/cars')
const CarsController = require('../controllers/CarController')
const {CarSchema} = require('../schemas')
const {GetPlateSchema} = require('../schemas')

const validateCar= (req,res,next)=>{
    const{error} = CarSchema.validate(req.body);
    if(error){
       const msg = error.details.map(el=>el.message).join(',')
       throw new ExpressError(msg, 400)
    }else{
       next();
    }
 }

 const validateGetPlate = (req, res, next) => {
   const { error } = GetPlateSchema.validate(req.query); // Validate req.query instead of req.body
   if (error) {
       const msg = error.details.map(el => el.message).join(',');
       throw new ExpressError(msg, 400); // Throw an ExpressError with the validation message
   } else {
       next(); // Proceed to the next middleware or route handler
   }
};

// Assuming router is an Express router instance
router.get('/search', validateGetPlate, catchAsync(CarsController.searchCarByPlate));
router.route('/new')
.get(isLoggedIn,catchAsync(CarsController.NewCarPage))

router.route('/')
.post(isLoggedIn, validateCar, catchAsync(CarsController.addCarRequest))

router.route('/all')
.get(isLoggedIn,catchAsync(CarsController.showAllCars))

router.route('/:id/edit')
.get(isLoggedIn,catchAsync(CarsController.CarEditPage))

router.route('/:id')
.get(catchAsync(CarsController.individualCarPage))
.put(isLoggedIn,validateCar,catchAsync(CarsController.editCarRequest))
.delete(isLoggedIn,catchAsync(CarsController.CarDeleteRequest))


module.exports =router;