const express = require('express');
const passport = require('passport');
const User = require('../models/user');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const AuthController = require('../controllers/authController')
const{isManager} = require('../middleware')

router.route('/register')
.get(isManager,catchAsync(AuthController.registerPage))
.post(isManager,catchAsync(AuthController.NewAccount))

// Login route
router.route('/login')
.get(catchAsync(AuthController.LoginPage))
.post(passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}),AuthController.LoginRequest)


// Logout route
router.get('/logout',AuthController.userLogoutRequest)

module.exports =router;