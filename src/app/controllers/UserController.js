const { emailValidation } = require("../../lib/validator");
const Handlebars = require("handlebars");
const userModel = require("../../models/user.model");
const commentModel = require("../../models/comment.model");
const helpers = require("../../lib/helpers");
Handlebars.registerHelper("isdefined", function (value) {
  if (typeof value !== undefined) return false;
  return true;
});
Handlebars.registerHelper("compare", function (v1, v2) {
  return v1 === v2;
});
class UserControllers {
  // Tạo trang đăng ký => GET
  getRegisterPage(req, res) {
    res.render("users/signup", { layout: false, error: req.flash("error") });
  }

  // Tạo Trang Đăng Nhập => GET
  getLoginPage(req, res) {
    res.render("users/login", { layout: false, error: req.flash("error") });
  }

  showupdateEmail(req, res) {
    const user = req.user;
    res.render("users/update-email", { layout: false, user });
  }
  async updateEmail(req, res) {
    const { id } = req.params;
    const email = req.body.email;
    const { error } = emailValidation({ email });
    const emailExist = await userModel.allWhere("email", email);
    const users = await userModel.single(req.params.id);
    if (error) {
      const err = error.details[0].message;
      res.render("users/update-email", {
        layout: false,
        users: users[0],
      });
    } else if (emailExist.length >= 1) {
      if (users[0].email != email) {
        res.render("users/update-email", {
          layout: false,
          users: users[0],
          err: "Email đã tồn tại",
        });
      } else {
        res.redirect("/user/profile");
      }
    } else {
      const newEmailUser = {
        id,
        email,
      };
      await userModel.update(newEmailUser);
      req.flash("success", "Cập nhật email thành công");
      res.redirect("/user/profile");
    }
  }
  // async showprofile(req, res){
  //     const users = await pool.query('SELECT * FROM users WHERE id = ?', req.params.id );
  //     res.render('users/profile',{layout: false,users: users[0]});
  // }
  async showupdatePassword(req, res) {
    res.render("users/update-password", {
      layout: false,
      user: req.user,
      err: req.flash("error"),
    });
  }
  async comment(req, res) {
    const newComment = {
      user_id: req.user.id,
      post_id: req.params.id,
      comment: req.body.message,
    };
    await commentModel.addComment(newComment);
    req.flash("comment", "Bình Luận Thành Công");
    res.redirect("back");
  }
  async updatePassword(req, res) {
    const id = req.params.id;
    const { username, email, newpassord } = req.body;
    let password = req.body.password;
    const user = await userModel.allWhere("username", username);
    const match = await helpers.matchPassword(password, user[0].password);
    if (match) {
      password = await helpers.encryptPassword(newpassord);
      const newPassword = {
        id,
        password,
      };
      await userModel.update(newPassword);
      req.flash("success", "Cập nhật mật khẩu thành công");
      res.redirect("/user/profile");
    } else {
      const users = await userModel.single(id);
      res.render("users/update-password", {
        layout: false,
        users: users[0],
        user: req.user,
        err: "Mật khẩu không đúng",
      });
    }
  }
}

module.exports = new UserControllers();
