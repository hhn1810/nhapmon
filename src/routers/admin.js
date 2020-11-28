const express = require("express");
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart();
const router = express.Router();
const adminController = require("../app/controllers/AdminController");
const { isAdmin } = require("../lib/auth");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: path.join(__dirname, "../public/uploads/img_titles/"),
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const uploadImage = multer({
  storage,
}).single("image");

// ----------------------------- Xử lý Category -----------------------

// Hiển thị tất cả Category
router.get("/category", adminController.cate);
// Hiển thị giao diện thêm Category
router.get("/category/add", adminController.categoryAdd);
// Xử lý thêm Category
router.post("/category/add", adminController.addCate);
// Hiển thị giao diện cập nhật Category
router.get("/category/update/:id", adminController.showupdateCate);
// Xử lý cập nhật Category
router.post("/category/update/:id", adminController.updateCate);
// Xử lý xóa Category
router.get("/category/delete/:id", adminController.delCate);

// --------------x--------------- Xử lý Category ------------x-----------

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});
router.get("/user/delete/:id", adminController.delUser);
router.get("/thongkebaiviet", adminController.thongkebaiviet);
router.get("/user", adminController.user);
router.get("/post", adminController.post);
router.get("/comment", adminController.comment);
router.get("/post/add", adminController.getaddPost);
router.get("/post/update/:id", adminController.getupdatePost);
router.post(
  "/post/update/:id",
  uploadImage,

  adminController.updatePost
);
router.post("/uploader", multipartMiddleware, adminController.upload);
router.post("/post/add", uploadImage, adminController.addPost);
router.get("/post/delete/:id", adminController.delPost);
router.get("/comment/delete/:id", adminController.delComment);
router.get("/", adminController.user);

module.exports = router;
