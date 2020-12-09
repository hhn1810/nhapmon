const pool = require("../../database");
const cateModel = require("../../models/category.model");
const postModel = require("../../models/post.model");
const commentModel = require("../../models/comment.model");
class SiteControllers {
  // [GET]
  async index(req, res) {
    const page = +req.query.page || 1;
    if (page < 0) page = 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    const list = await postModel.all();
    const post = await postModel.page(limit, offset);
    const total = await postModel.count();
    const nPages = Math.ceil(total / limit);
    const postTang = await pool.query(
      "SELECT `posts`.* , `category`.`cate_name` as tencate FROM `posts`,`category` WHERE `posts`.`cate_id` = `category`.`id` ORDER BY created_at ASC LIMIT 5"
    );
    res.render("home", {
      list,
      post,
      postTang,
      user: req.user,
      prev_value: page - 1,
      next_value: page + 1,
      can_go_prev: page > 1,
      can_go_next: page < nPages,
      success: req.flash("success"),
    });
  }
  // [GET] /about
  async search(req, res) {
    const search = req.query.search;
    const data = await postModel.search(search);
    const page = +req.query.page || 1;
    if (page < 0) page = 1;
    const limit = 2;
    const offset = (page - 1) * limit;
    const post = await postModel.pageBySearch(search, limit, offset);
    const total = await postModel.countBySearch(search);
    const nPages = Math.ceil(total / limit);
    res.render("search", {
      post: post,
      query: search,
      prev_value: page - 1,
      next_value: page + 1,
      can_go_prev: page > 1,
      can_go_next: page < nPages,
    });
  }

  about(req, res) {
    res.render("about");
  }
  contact(req, res) {
    res.render("contact");
  }
  async showPost(req, res) {
    const slug = req.params.slug;
    let userid;
    const post = await pool.query("SELECT * FROM posts WHERE slug = ?", slug);
    const view = post[0].view + 1;
    const newPost = {
      id: post[0].id,
      view,
    };
    await postModel.update(newPost);
    const message = await commentModel.allDK(post[0].id);
    const soLuong = await commentModel.soLuong(post[0].id);
    if (req.user !== undefined) {
      userid = req.user.id;
    } else {
      userid = 0;
    }
    res.render("single_post", {
      soLuong: soLuong[0],
      comments: message,
      post: post[0],
      comment: req.flash("comment"),
      userid,
      success: req.flash("success"),
    });
  }
  async deleteComment(req, res) {
    await commentModel.delete(req.params.id);
    req.flash("success", "Xóa Bình Luận Thành Công ");
    res.redirect("back");
  }
  async showCate(req, res) {
    const page = +req.query.page || 1;
    if (page < 0) page = 1;
    const limit = 2;
    const offset = (page - 1) * limit;
    const slug = req.params.slug;
    const cate = await cateModel.allWhere("slug", slug);
    const firstPost = await pool.query(
      "SELECT * FROM posts WHERE cate_id = ? limit 1",
      [cate[0].id]
    );
    const post = await postModel.pageByCat(cate[0].id, limit, offset);
    const total = await postModel.countByCat(cate[0].id);
    const nPages = Math.ceil(total / limit);
    res.render("category_post", {
      cate: cate[0],
      post,
      firstPost: firstPost[0],
      prev_value: page - 1,
      next_value: page + 1,
      can_go_prev: page > 1,
      can_go_next: page < nPages,
    });
  }
}

module.exports = new SiteControllers();
