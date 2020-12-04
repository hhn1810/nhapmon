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
router.get("/category", isAdmin, adminController.cate);
// Hiển thị giao diện thêm Category
router.get("/category/add", isAdmin, adminController.categoryAdd);
// Xử lý thêm Category
router.post("/category/add", isAdmin, adminController.addCate);
// Hiển thị giao diện cập nhật Category
router.get("/category/update/:id", isAdmin, adminController.showupdateCate);
// Xử lý cập nhật Category
router.post("/category/update/:id", isAdmin, adminController.updateCate);
// Xử lý xóa Category
router.get("/category/delete/:id", isAdmin, adminController.delCate);

// --------------x--------------- Xử lý Category ------------x-----------

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});
router.get("/user/delete/:id", isAdmin, adminController.delUser);
router.get("/thongke/:slug", isAdmin, adminController.thongkebaiviet);
router.get("/user", isAdmin, adminController.user);
router.get("/post", isAdmin, adminController.post);
router.get("/comment", isAdmin, adminController.comment);
router.get("/post/add", isAdmin, adminController.getaddPost);
router.get("/post/update/:id", isAdmin, adminController.getupdatePost);
router.post(
  "/post/update/:id",
  uploadImage,

  isAdmin,
  adminController.updatePost
);
router.post("/uploader", multipartMiddleware, isAdmin, adminController.upload);
router.post("/post/add", uploadImage, isAdmin, adminController.addPost);
router.get("/post/delete/:id", isAdmin, adminController.delPost);
router.get("/comment/delete/:id", isAdmin, adminController.delComment);
router.get("/", isAdmin, adminController.user);

module.exports = router;
