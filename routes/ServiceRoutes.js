
//setting up express
const express = require('express');
const router = express.Router();
//error handling
const catchAsync = require('../utils/catchAsync');
const ExpressError =require('../utils/ExpressError'); 
const{ServiciiSchema} =  require('../schemas');
const{isManager} = require('../middleware');
//cloudinary
const multer  = require('multer')
const {Sstorage} = require('../cloudinary')
const modeling = require('../cloudinary')
const upload = multer({storage: Sstorage});


const servicesController =  require('../controllers/ServicesControler')

const Services = require('../models/services');
const validateService= (req,res,next)=>{
    const{error} = ServiciiSchema.validate(req.body);
    if(error){
       const msg = error.details.map(el=>el.message).join(',')
       throw new ExpressError(msg, 400)
    }else{
       next();
    }
 }


 router.route('/')
.post(isManager, upload.array('image'), validateService, catchAsync(servicesController.NewServiceRequest))

router.get('/new',isManager ,catchAsync(servicesController.ServicesNewPage))



router.route('/:id')
.get(catchAsync(servicesController.ServiceIndividual))
.put( isManager, upload.array('image'),validateService, catchAsync(servicesController.serviceEditRequest))
.delete(isManager,catchAsync(servicesController.serviceDeleteRequest))


router.route('/:id/edit')
.get(isManager,catchAsync(servicesController.ServiceEditPage))



 module.exports = router;