const express = require('express');
const router = express.Router();
const userController = require('../app/controllers/UserController');
const passport = require('passport');
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');
const { registerValidation ,loginValidation} = require('../lib/validator');

router.get('/singup',userController.getRegisterPage);
router.post('/signup',async (req, res, next) => {
    const {username,email,password,repassword} = req.body;
    const { error } = registerValidation({username,email,password,repassword}); 
    const usernameExist = await pool.query('SELECT username FROM users WHERE username = ? ',req.body.username);
    if(error) {
        const err = error.details[0].message;
        req.flash('error', err);
        res.redirect('/user/singup');
    }else if(usernameExist.length >=1){
        req.flash('error', 'Username đã tồn tại');
        res.redirect('/user/singup');
    }else{
        passport.authenticate('local.signup', {
            successRedirect: '/user/profile',
            failureRedirect: '/user/singup',
            failureFlash: true
    })(req, res, next);
}
});



router.get('/login',userController.getLoginPage);
router.post('/login',async (req, res, next) => {
    const {username,password} = req.body;
    const { error } = loginValidation({username,password});
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    const user = rows[0];
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
                successRedirect: '/user/profile',
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
    res.redirect('/');
});
router.get('/changePassword/:id',userController.showupdatePassword);
router.get('/changeEmail/:id',userController.showupdateEmail);
router.post('/changeEmail/:id',userController.updateEmail);
module.exports = router;