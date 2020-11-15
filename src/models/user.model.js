const db = require('../utils/db');
const TBL_USER = 'users';
module.exports = {
    allWhere: function(col,role){
        return db.loadWhere(TBL_USER,role,col);
    },
    add: function(entity){
        return db.add(TBL_USER,entity);
    },
    single: function(id){
        return db.load(`SELECT * FROM ${TBL_USER} WHERE id = ${id}`);
    },
    update: function(entity){
        const condition = {
            id: entity.id
        }
        delete entity.id;
        return db.update(TBL_USER,entity,condition);
    },
    delete: function(id){
        const condition = {
            id: id
        }
        return db.delete(TBL_USER,condition);
    }
}