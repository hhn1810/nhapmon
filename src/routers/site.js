const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');

const siteController = require('../app/controllers/SiteController');


router.get('/about', siteController.about);
router.get('/contact', siteController.contact);
router.get('/home', siteController.index);
router.get('/',siteController.index);
module.exports = router;