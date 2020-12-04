const Handlebars = require("handlebars");
const categoryModel = require("../../models/category.model");
const userModel = require("../../models/user.model");
const postModel = require("../../models/post.model");
const commentModel = require("../../models/comment.model");
const fs = require("fs");
const excel = require("exceljs");
const helpers = require("../../lib/helpers");
const multer = require("multer");
const path = require("path");
Handlebars.registerHelper("isNull", function (updated_at) {
  if (updated_at === null) return true;
  return false;
});
Handlebars.registerHelper("add", function (bien, page) {
  if (page === 1) {
    return bien + 1;
  } else {
    return bien + 1 + 5 * (page - 1);
  }
});
class AdminControllers {
  // Hiển thị tất cả Category GET
  async cate(req, res) {
    console.log(req.user);
    const category = await categoryModel.all();
    category.forEach((element) => {
      const day = element.created_at;
      element.created_at =
        day.getDate() +
        "/" +
        (day.getMonth() + 1) +
        "/" +
        day.getFullYear() +
        " " +
        day.getHours() +
        ":" +
        day.getMinutes();
    });
    category.forEach((element) => {
      if (element.updated_at === null) {
        element.updated_at = "Chưa Cập Nhật";
      } else {
        const day = element.updated_at;
        element.updated_at =
          day.getDate() +
          "/" +
          (day.getMonth() + 1) +
          "/" +
          day.getFullYear() +
          " " +
          day.getHours() +
          ":" +
          day.getMinutes();
      }
    });
    res.render("category/index", {
      layout: false,
      category,
      success: req.flash("success"),
    });
  }

  // Hiển thị giao diện thêm Category GET
  categoryAdd(req, res) {
    res.render("category/add", { layout: false });
  }

  // Xử lý thêm Category POST
  async addCate(req, res) {
    const cate_name = req.body.category;
    const slug = helpers.changeToSlug(cate_name);
    const cate = await categoryModel.allWhere("cate_name", cate_name);
    if (cate[0] === undefined) {
      const newCategory = {
        cate_name,
        slug,
      };
      await categoryModel.add(newCategory);
      req.flash("success", "Thêm thành công");
      res.redirect("./");
    } else {
      req.flash("success", `Danh Mục ${cate_name} đã tồn tại`);
      res.redirect("./");
    }
  }

  // Hiển thị giao diện cập nhật Category GET
  async showupdateCate(req, res) {
    const id = req.params.id;
    const category = await categoryModel.single(id);
    res.render("category/update", { layout: false, category: category[0] });
  }

  // Xử lý cập nhật Category POST
  async updateCate(req, res) {
    const { id } = req.params;
    const cate_name = req.body.category;
    console.log(cate_name);
    const slug = helpers.changeToSlug(cate_name);
    const cate = await categoryModel.allWhere("cate_name", cate_name);
    if (cate[0] === undefined) {
      const newCategory = {
        id,
        cate_name,
        slug,
      };
      await categoryModel.update(newCategory);
      req.flash("success", "Cập nhật thành công");
      res.redirect("../");
    } else {
      req.flash("success", `Danh Mục ${cate_name} đã tồn tại`);
      res.redirect("../");
    }
  }

  // Xử lý xóa Category POST
  async delCate(req, res) {
    const id = req.params.id;
    await categoryModel.delete(id);
    req.flash("success", "Xóa Thành Công");
    res.redirect("back");
  }

  upload(req, res) {
    var fs = require("fs");
    fs.readFile(req.files.upload.path, function (err, data) {
      var newPath =
        "D:\\Blog-Nodejs-Express-Mysql\\src\\public\\uploads\\" +
        req.files.upload.name;
      fs.writeFile(newPath, data, function (err) {
        if (err) console.log({ err: err });
        else {
          var html = "";
          html += "<script type='text/javascript'>";
          html += "    var funcNum = " + req.query.CKEditorFuncNum + ";";
          html += '    var url     = "/uploads/' + req.files.upload.name + '";';
          html += '    var message = "Ảnh đã được tải lên";';
          html += "";
          html +=
            "    window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";
          html += "</script>";
          res.send(html);
        }
      });
    });
  }
  // BÊN USER
  async user(req, res) {
    const users = await userModel.allWhere("role", "Author");
    users.forEach((element) => {
      const day = element.created_at;
      element.created_at =
        day.getDate() +
        "/" +
        (day.getMonth() + 1) +
        "/" +
        day.getFullYear() +
        " " +
        day.getHours() +
        ":" +
        day.getMinutes();
    });
    users.forEach((element) => {
      if (element.updated_at === null) {
        element.updated_at = "Chưa Cập Nhật";
      } else {
        const day = element.updated_at;
        element.updated_at =
          day.getDate() +
          "/" +
          (day.getMonth() + 1) +
          "/" +
          day.getFullYear() +
          " " +
          day.getHours() +
          ":" +
          day.getMinutes();
      }
    });
    res.render("admin/index", {
      layout: false,
      users,
      success: req.flash("success"),
    });
  }
  async delUser(req, res) {
    const id = req.params.id;
    await userModel.delete(id);
    req.flash("success", "Xóa Thành Công ");
    res.redirect("back");
  }
  //  POST

  async post(req, res) {
    const PAGE_SIZE = 5;
    let banghitruoc = 1;
    if (isNaN(req.query.page)) res.redirect("/admin/post?page=1");
    let page = +req.query.page || 1;
    let banghi = page * PAGE_SIZE;
    if (page < 0) page = 1;
    const total = await postModel.count();
    const nPages = Math.ceil(total / PAGE_SIZE);
    if (page > nPages) res.redirect("/admin/post?page=" + nPages);
    let offset = (page - 1) * PAGE_SIZE;

    if (page == 1) {
      banghitruoc = 1;
    } else {
      banghitruoc = (page - 1) * PAGE_SIZE + 1;
    }
    if (banghi > total) banghi = total;

    const post = await postModel.findCatName(PAGE_SIZE, offset);
    post.forEach((element) => {
      const day = element.created_at;
      element.created_at =
        day.getDate() +
        "/" +
        (day.getMonth() + 1) +
        "/" +
        day.getFullYear() +
        " " +
        day.getHours() +
        ":" +
        day.getMinutes();
    });
    post.forEach((element) => {
      if (element.updated_at === null) {
        element.updated_at = "Chưa Cập Nhật";
      } else {
        const day = element.updated_at;
        element.updated_at =
          day.getDate() +
          "/" +
          (day.getMonth() + 1) +
          "/" +
          day.getFullYear() +
          " " +
          day.getHours() +
          ":" +
          day.getMinutes();
      }
    });
    res.render("post/index", {
      layout: false,
      post,
      page,
      total,
      banghi,
      banghitruoc,
      nPages,
      success: req.flash("success"),
      message: req.flash("message"),
      prev_value: page - 1,
      next_value: page + 1,
      can_go_prev: page > 1,
      can_go_next: page < nPages,
    });
  }
  getaddPost(req, res) {
    res.render("post/add", { layout: false, msg: req.flash("message") });
  }
  async getupdatePost(req, res) {
    const post = await postModel.allWhere("id", req.params.id);
    res.render("post/update", {
      layout: false,
      msg: req.flash("message"),
      post: post[0],
    });
  }
  async addPost(req, res) {
    const content = req.body.content;
    const cate_id = req.body.cate;
    const name_post = req.body.name_post;
    const title = req.body.title;
    const image = req.file.filename;
    let slug = helpers.changeToSlug(name_post);
    let check = await postModel.allWhere("name_post", name_post);
    if (check < 1) {
      const newPost = {
        cate_id,
        name_post,
        title,
        slug,
        image,
        content,
      };
      await postModel.add(newPost);
      req.flash("success", "Thêm thành công");
      res.redirect("../post");
    } else {
      req.flash("message", "Tên Post Không Được Trùng");
      res.redirect("add");
    }
  }
  async updatePost(req, res) {
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(
      path.extname(req.file.originalname).toLowerCase()
    );
    // Check mime
    const mimetype = filetypes.test(req.file.mimetype);

    const id = req.params.id;
    const { name_post, cate_id, title, content } = req.body;
    let slug = helpers.changeToSlug(name_post);
    if (!mimetype || !extname) {
      req.flash("message", "Chỉ file ảnh");
      res.redirect("../");
    } else if (req.file !== undefined) {
      const image = req.file.filename;
      const newPost = {
        id,
        cate_id,
        name_post,
        title,
        slug,
        image,
        content,
      };
      await postModel.update(newPost);
      req.flash("success", "Cập Nhật Thành Công");
      res.redirect("../");
    } else {
      const newPost = {
        id,
        cate_id,
        name_post,
        title,
        slug,
        content,
      };
      await postModel.update(newPost);
      req.flash("success", "Cập Nhật Thành Công");
      res.redirect("../");
    }
  }
  async delPost(req, res) {
    const id = req.params.id;
    await postModel.delete(id);
    req.flash("success", "Xóa Thành Công ");
    res.redirect("back");
  }

  // Comment
  async comment(req, res) {
    const comment = await commentModel.all();
    comment.forEach((element) => {
      const day = element.created_at;
      element.created_at =
        day.getDate() +
        "/" +
        (day.getMonth() + 1) +
        "/" +
        day.getFullYear() +
        " " +
        day.getHours() +
        ":" +
        day.getMinutes();
    });
    comment.forEach((element) => {
      if (element.updated_at === null) {
        element.updated_at = "Chưa Cập Nhật";
      } else {
        const day = element.updated_at;
        element.updated_at =
          day.getDate() +
          "/" +
          (day.getMonth() + 1) +
          "/" +
          day.getFullYear() +
          " " +
          day.getHours() +
          ":" +
          day.getMinutes();
      }
    });
    res.render("admin/comment", { layout: false, comment });
  }
  async delComment(req, res) {
    const id = req.params.id;
    await commentModel.delete(id);
    req.flash("success", "Xóa Thành Công ");
    res.redirect("back");
  }
  async thongkebaiviet(req, res) {
    const slug = req.params.slug;
    switch (slug) {
      case "baiviet":
        const post = await postModel.findCatNameAs();
        post.forEach((element) => {
          const day = element.created_at;
          element.created_at =
            day.getDate() +
            "/" +
            (day.getMonth() + 1) +
            "/" +
            day.getFullYear() +
            " " +
            day.getHours() +
            " giờ : " +
            day.getMinutes() +
            " phút";
        });
        post.forEach((element) => {
          if (element.updated_at === null) {
            element.updated_at = "Chưa Cập Nhật";
          } else {
            let updated_atdate = element.updated_at.getDate();
            let updated_atmonth = element.updated_at.getMonth() + 1;
            let updated_atyear = element.updated_at.getFullYear();
            element.updated_at =
              updated_atdate + "/" + updated_atmonth + "/" + updated_atyear;
          }
        });
        const jsonData = JSON.parse(JSON.stringify(post));
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Thống Kê Bài Viết", {
          properties: { tabColor: { argb: "FF00FF00" } },
          pageSetup: { paperSize: 9, orientation: "landscape" },
        });
        worksheet.headerFooter.firstHeader = "THỐNG KÊ BÀI VIẾT";
        worksheet.columns = [
          { header: "Id", key: "id", width: 10 },
          { header: "Tên Bài Viết", key: "name_post", width: 30 },
          { header: "Loại Danh Mục", key: "cate_name", width: 30 },
          { header: "Mô Tả Ngắn", key: "title", width: 30 },
          { header: "Nội Dung", key: "content", width: 100 },
          { header: "Ngày Tạo", key: "created_at", width: 30 },
          { header: "Ngày Cập Nhật", key: "updated_at", width: 30 },
          { header: "Số Bình Luận", key: "SoLuongCmt", width: 30 },
        ];
        worksheet.addRows(jsonData);
        const fileName = "ThongKeSoLuongBaiViet";
        // Write to File
        workbook.xlsx.writeFile(`D:\\${fileName}.xlsx`).then(function () {
          req.flash("success", "Tải file thành công , File ở ổ D");
          res.redirect("/admin/post");
        });
    }
  }
}

module.exports = new AdminControllers();
