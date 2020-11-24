const db = require("../utils/db");
const TBL_CATEGORY = "category";
module.exports = {
  all: function () {
    return db.load(`SELECT * FROM ${TBL_CATEGORY}`);
  },
  single: function (id) {
    return db.load(`SELECT * FROM ${TBL_CATEGORY} WHERE id = ${id}`);
  },
  add: function (entity) {
    return db.add("category", entity);
  },
  allWhere: function (col, role) {
    return db.loadWhere(TBL_CATEGORY, role, col);
  },
  allWithDetail: function () {
    return db.load(
      "SELECT `category`.*,COUNT(`posts`.`cate_id`) as SoLuong FROM `category` left join `posts` on `category`.`id`= `posts`.`cate_id` GROUP BY `category`.`id`,`category`.`cate_name`"
    );
  },
  update: function (entity) {
    const condition = {
      id: entity.id,
    };
    delete entity.id;
    return db.update(TBL_CATEGORY, entity, condition);
  },
  delete: function (id) {
    const condition = {
      id: id,
    };
    return db.delete(TBL_CATEGORY, condition);
  },
};
