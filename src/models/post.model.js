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
    ,
    pageByCat: function(catId,limit,offset){
        return db.load(`SELECT * FROM ${TBL_POST} WHERE cate_id = ${catId} limit ${limit} offset ${offset}`);
    },
    page: function(limit,offset){
        return db.load(`SELECT * FROM ${TBL_POST} limit ${limit} offset ${offset}`);
    },
    countByCat: async function(catId){
        const rows = await db.load(`SELECT  COUNT(*) AS total FROM ${TBL_POST} WHERE cate_id = ${catId}`);
        return rows[0].total;
    },
    count: async function(){
        const rows = await db.load(`SELECT  COUNT(*) AS total FROM ${TBL_POST}`);
        return rows[0].total;
    },
}