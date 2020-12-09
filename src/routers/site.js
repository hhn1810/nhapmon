const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../lib/auth");

const siteController = require("../app/controllers/SiteController");

router.get("/about", siteController.about);
router.get("/timkiem", siteController.search);
router.get("/contact", siteController.contact);
router.get("/home", siteController.index);
router.get("/post/:slug", siteController.showPost);
router.get("/cate/:slug", siteController.showCate);
router.get("/deleteComment/:id", siteController.deleteComment);
router.get("/", siteController.index);
module.exports = router;
