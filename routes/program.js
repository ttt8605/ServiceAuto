const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')

router.route('/program')
.get(catchAsync(programPage = async(req,res)=>{
    res.render('program')
}))





module.exports = router;