const db = require("../utils/db");
const TBL_COMMENT = "comment_post";
module.exports = {
  allDK: function (post_id) {
    return db.load(
      `SELECT comment_post.id ,comment_post.user_id, comment_post.comment,posts.name_post,users.username, comment_post.created_at AS created, comment_post.updated_at AS updated, users.username FROM comment_post INNER JOIN users ON comment_post.user_id = users.id INNER JOIN posts ON comment_post.post_id = posts.id WHERE post_id = ${post_id}`
    );
  },
  all: function () {
    return db.load(
      "SELECT comment_post.id,comment_post.comment,comment_post.updated_at, posts.name_post,comment_post.created_at,users.username FROM comment_post INNER JOIN users ON comment_post.user_id= users.id INNER JOIN posts ON comment_post.post_id = posts.id"
    );
  },
  allLimit: function (limit, offset) {
    return db.load(
      `SELECT comment_post.id,comment_post.comment,comment_post.updated_at, posts.name_post,comment_post.created_at,users.username FROM comment_post INNER JOIN users ON comment_post.user_id= users.id INNER JOIN posts ON comment_post.post_id = posts.id ORDER BY comment_post.created_at DESC LIMIT ${limit} OFFSET ${offset}`
    );
  },
  soLuong: function (post_id) {
    return db.load(
      `SELECT COUNT(post_id) as SoLuong FROM comment_post WHERE post_id =${post_id}`
    );
  },
  single: function (id) {
    return db.load(`SELECT * FROM ${TBL_COMMENT} WHERE id = ${id}`);
  },
  thongke: function () {
    return db.load(
      "SELECT`comment_post`.*, `posts`.`name_post`,`users`.`username` FROM `comment_post`,`posts`,`users` WHERE `comment_post`.`user_id`=`users`.`id` and `comment_post`.`post_id` = `posts`.`id`"
    );
  },
  count: async function () {
    const rows = await db.load(`SELECT  COUNT(*) AS total FROM ${TBL_COMMENT}`);
    return rows[0].total;
  },
  allWhere: function (col, role) {
    return db.loadWhere(TBL_COMMENT, role, col);
  },
  update: function (entity) {
    const condition = {
      id: entity.id,
    };
    delete entity.id;
    return db.update(TBL_COMMENT, entity, condition);
  },
  addComment: function (entity) {
    return db.add(TBL_COMMENT, entity);
  },
  delete: function (id) {
    const condition = {
      id: id,
    };
    return db.delete(TBL_COMMENT, condition);
  },
};
