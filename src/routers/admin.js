const express = require('express');
const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();
const router = express.Router();
const adminController =  require('../app/controllers/AdminController');
const {isAdmin} = require('../lib/auth');

// ----------------------------- Xử lý Category -----------------------


// Hiển thị tất cả Category
router.get('/category',isAdmin,adminController.cate);
// Hiển thị giao diện thêm Category
router.get('/category/add',isAdmin,adminController.categoryAdd);
// Xử lý thêm Category
router.post('/category/add',isAdmin,adminController.addCate);
// Hiển thị giao diện cập nhật Category
router.get('/category/update/:id',isAdmin,adminController.showupdateCate);
// Xử lý cập nhật Category
router.post('/category/update/:id',isAdmin,adminController.updateCate);
// Xử lý xóa Category
router.get('/category/delete/:id',isAdmin,adminController.delCate);

// --------------x--------------- Xử lý Category ------------x-----------





router.post('/uploader', multipartMiddleware,adminController.upload);
router.get('/user/delete/:id',adminController.delUser);
router.get('/user',isAdmin,adminController.user);
router.get('/',isAdmin,adminController.user);







module.exports = router;