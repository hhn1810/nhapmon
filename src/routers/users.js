const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/UserController');
const passport = require('passport');
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');
const { registerValidation ,loginValidation} = require('../lib/validator');
const userModel = require('../models/user.model');

router.get('/signup',userController.getRegisterPage);
router.post('/signup',async (req, res, next) => {
    const {username,email,password,repassword} = req.body;
    const { error } = registerValidation({username,email,password,repassword}); 
    const usernameExist = await userModel.allWhere('username',username);
    const emailExist = await userModel.allWhere('email',email);
    if(error) {
        const err = error.details[0].message;
        req.flash('error', err);
        res.redirect('/user/signup');
    }else if(usernameExist.length >=1){
        req.flash('error', 'Username đã tồn tại');
        res.redirect('/user/sigup');
    }
    else if(emailExist.length >=1)
    {
        req.flash('error', 'Email đã tồn tại');
        res.redirect('/user/signup');
    }else{
        passport.authenticate('local.signup', {
            successRedirect: '../',
            failureRedirect: '/user/singup',
            failureFlash: true
    })(req, res, next);
}
});



router.get('/login',userController.getLoginPage);
router.post('/login',async (req, res, next) => {
    const {username,password} = req.body;
    const { error } = loginValidation({username,password});
    const rows = await userModel.allWhere('username',username);
    const user = rows[0];
    if(rows < 1){
        req.flash('error','Tài khoản không tồn tại');
        res.redirect('/user/login');
    }
    if (error) {
        const err = error.details[0].message;
        req.flash('error', err);
        res.redirect('/user/login');
    }else{
        if(user.role === 'Admin'){
            passport.authenticate('local.login', {
                successRedirect: '/admin',
                failureRedirect: '/user/login',
                failureFlash: true
            })(req, res, next);
        }
        else{
            passport.authenticate('local.login', {
                successRedirect: '../',
                failureRedirect: '/user/login',
                failureFlash: true
            })(req, res, next);
        }
        
    }
    
  });

router.get('/profile',isLoggedIn, (req, res) => {
    res.render('users/profile',{layout: false,user: req.user});
  });
router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success','Bạn đã đăng xuất');
    res.redirect('/');
});
router.get('/changePassword/:id',isLoggedIn,userController.showupdatePassword);
router.get('/changeEmail/:id',isLoggedIn,userController.showupdateEmail);
router.post('/changeEmail/:id',isLoggedIn,userController.updateEmail);
router.post('/comment/:id',isLoggedIn,userController.comment);
module.exports = router;