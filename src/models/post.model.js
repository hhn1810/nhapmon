const db = require('../utils/db');
const TBL_POST = 'posts';
module.exports = {
    all: function(){
        return db.load(`SELECT * FROM ${TBL_POST}`);
    },
    single: function(id){
        return db.load(`SELECT * FROM ${TBL_POST} WHERE id = ${id}`);
    },
    allWhere: function(col,name){
        return db.loadWhere(TBL_POST,name,col);
    },
    add: function(entity){
        return db.add(TBL_POST,entity);
    },
    update: function(entity){
        const condition = {
            id: entity.id
        }
        delete entity.id;
        return db.update(TBL_POST,entity,condition);
    },
    delete: function(id){
        const condition = {
            id: id
        }
        return db.delete(TBL_POST,condition);
    },
    findCatName: function(){
        return db.load('SELECT `posts`.`id`,`name_post`,`title`,`posts`.`slug`,`image`,`content`,`posts`.`created_at`,`posts`.`updated_at`,`category`.`cate_name`  FROM `posts`,`category` WHERE `category`.`id`=`posts`.`cate_id`');
    },
    postTang: function(){
        return db.load('SELECT * FROM `posts` ORDER BY created_at DESC LIMIT 5');
    }
}