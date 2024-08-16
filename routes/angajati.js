
//setting up express
const express = require('express');
const router = express.Router();
//error handling
const catchAsync = require('../utils/catchAsync');
const ExpressError =require('../utils/ExpressError'); 
const{AngajatiSchema} =  require('../schemas');
const{isManager} = require('../middleware');
//cloudinary
const multer  = require('multer')
const {AnStorage} = require('../cloudinary')
const modeling = require('../cloudinary')
const upload = multer({storage: AnStorage});


const angajatiController =  require('../controllers/AngajatiController')

const angajati = require('../models/Angajati');
const validateAn= (req,res,next)=>{
    const{error} = AngajatiSchema.validate(req.body);
    if(error){
       const msg = error.details.map(el=>el.message).join(',')
       throw new ExpressError(msg, 400)
    }else{
       next();
    }
 }


 router.route('/')
.post(isManager, upload.array('image'), validateAn, catchAsync(angajatiController.NewAnRequest))

router.get('/new',isManager ,catchAsync(angajatiController.AngajatiNewPage))



router.route('/:id')
.put( isManager, upload.array('image'),validateAn, catchAsync(angajatiController.AnEditRequest))
.delete(isManager,catchAsync(angajatiController.AnDeleteRequest))


router.route('/:id/edit')
.get(isManager,catchAsync(angajatiController.AnEditPage))



 module.exports = router;