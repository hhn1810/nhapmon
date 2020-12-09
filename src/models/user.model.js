const db = require("../utils/db");
const TBL_USER = "users";
module.exports = {
  allWhere: function (col, role) {
    return db.loadWhere(TBL_USER, role, col);
  },

  allWhereLimit: function (col, role, limit, offset) {
    return db.loadWhereLimit(TBL_USER, role, col, limit, offset);
  },
  add: function (entity) {
    return db.add(TBL_USER, entity);
  },
  countUser: function (col, role) {
    return db.countWhere(TBL_USER, role, col);
  },
  single: function (id) {
    return db.load(`SELECT * FROM ${TBL_USER} WHERE id = ${id}`);
  },
  all: function (limit, offset) {
    return db.load(`SELECT * FROM ${TBL_USER} LIMIT ${limit} OFFSET ${offset}`);
  },
  all: function (limit, offset) {
    return db.load(`SELECT COUNT(*) FROM ${TBL_USER} `);
  },
  update: function (entity) {
    const condition = {
      id: entity.id,
    };
    delete entity.id;
    return db.update(TBL_USER, entity, condition);
  },
  delete: function (id) {
    const condition = {
      id: id,
    };
    return db.delete(TBL_USER, condition);
  },
};
