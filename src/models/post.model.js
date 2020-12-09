const db = require("../utils/db");
const TBL_POST = "posts";
module.exports = {
  all: function () {
    return db.load(`SELECT * FROM ${TBL_POST}`);
  },
  tatca: function (limit, offset) {
    return db.load(
      `SELECT * FROM ${TBL_POST}  LIMIT ${limit} OFFSET ${offset}`
    );
  },
  single: function (id) {
    return db.load(`SELECT * FROM ${TBL_POST} WHERE id = ${id}`);
  },
  allWhere: function (col, name) {
    return db.loadWhere(TBL_POST, name, col);
  },
  add: function (entity) {
    return db.add(TBL_POST, entity);
  },
  update: function (entity) {
    const condition = {
      id: entity.id,
    };
    delete entity.id;
    return db.update(TBL_POST, entity, condition);
  },
  delete: function (id) {
    const condition = {
      id: id,
    };
    return db.delete(TBL_POST, condition);
  },
  findCatName: function (limit, offset) {
    return db.load(
      `SELECT posts.*,category.cate_name  FROM posts,category WHERE category.id=posts.cate_id ORDER BY posts.view desc , posts.created_at desc, posts.updated_at desc LIMIT ${limit} OFFSET ${offset} `
    );
  },
  findCatName1: function () {
    return db.load(
      `SELECT posts.*,category.cate_name  FROM posts,category WHERE category.id=posts.cate_id`
    );
  },
  findCatNameAs: function () {
    return db.load(
      "SELECT `posts`.*,`category`.`cate_name`,COUNT(`comment_post`.id) as SoLuongCmt FROM `posts`,`comment_post`,`category` WHERE `posts`.`id`=`comment_post`.`post_id` AND `posts`.`cate_id`=`category`.`id` GROUP BY `posts`.`id`"
    );
  },
  postTang: function () {
    return db.load("SELECT * FROM `posts` ORDER BY created_at DESC LIMIT 5");
  },
  pageByCat: function (catId, limit, offset) {
    return db.load(
      `SELECT * FROM ${TBL_POST} WHERE cate_id = ${catId} limit ${limit} offset ${offset}`
    );
  },
  pageBySearch: function (data, limit, offset) {
    return db.load(
      `SELECT * FROM ${TBL_POST} WHERE LOWER(name_post) like LOWER('%${data}%') limit ${limit} offset ${offset}`
    );
  },
  page: function (limit, offset) {
    return db.load(
      `SELECT ${TBL_POST}.*,category.cate_name FROM ${TBL_POST},category where ${TBL_POST}.cate_id = category.id limit ${limit} offset ${offset}`
    );
  },
  countByCat: async function (catId) {
    const rows = await db.load(
      `SELECT  COUNT(*) AS total FROM ${TBL_POST} WHERE cate_id = ${catId}`
    );
    return rows[0].total;
  },
  countBySearch: async function (data) {
    const rows = await db.load(
      `SELECT  COUNT(*) AS total FROM ${TBL_POST} WHERE LOWER(name_post) like LOWER('%${data}%') `
    );
    return rows[0].total;
  },
  count: async function () {
    const rows = await db.load(`SELECT  COUNT(*) AS total FROM ${TBL_POST}`);
    return rows[0].total;
  },
  search: async function (data) {
    const rows = await db.load(
      `SELECT * FROM ${TBL_POST} WHERE LOWER(name_post) like LOWER('%${data}%') `
    );
    return rows;
  },
};
