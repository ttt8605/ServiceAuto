
//setting up express
const express = require('express');
const router = express.Router();
//error handling
const catchAsync = require('../utils/catchAsync');
const ExpressError =require('../utils/ExpressError'); 
const{PostariSchema} =  require('../schemas');
const{isManager} = require('../middleware');
//cloudinary
const multer  = require('multer')
const {PostariStorage} = require('../cloudinary')
const modeling = require('../cloudinary')
const upload = multer({storage: PostariStorage});


const postariController =  require('../controllers/postariController')

const Post = require('../models/postari');
const validatePost= (req,res,next)=>{
    const{error} = PostariSchema.validate(req.body);
    if(error){
       const msg = error.details.map(el=>el.message).join(',')
       throw new ExpressError(msg, 400)
    }else{
       next();
    }
 }


 router.route('/')
.post(isManager, upload.array('image'), validatePost, catchAsync(postariController.NewPostRequest))

router.get('/new',isManager ,catchAsync(postariController.PostariNewPage))



router.route('/:id')
.get(catchAsync(postariController.PostIndividual))
.put( isManager, upload.array('image'),validatePost, catchAsync(postariController.PostEditRequest))
.delete(isManager,catchAsync(postariController.PostDeleteRequest))


router.route('/:id/edit')
.get(isManager,catchAsync(postariController.PostEditPage))



 module.exports = router;