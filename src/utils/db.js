const mysql = require('mysql');

const config = require('../config/default.json');

const pool = mysql.createPool(config.database);

module.exports = {
    load: function(sql){
        return new Promise(function (resolve, reject){
            pool.query(sql, function(error, results, fields){
                if(error) {
                    return reject(error);
                }
                resolve(results);
            })
        })

    },
    loadWhere: function(table,entity,col){
        return new Promise(function (resolve, reject){
            const sql = `SELECT * FROM ${table} WHERE ${col} = ?`;
            pool.query(sql, entity,function(error, results, fields){
                if(error) {
                    return reject(error);
                }
                resolve(results);
            })
        })

    },
    add: function(table,entity){
        return new Promise(function (resolve, reject){
            const sql = `INSERT INTO ${table} SET ?`;
            pool.query(sql, entity,function(error, results, fields){
                if(error) {
                    return reject(error);
                }
                resolve(results);
            })
        })
    },
    update: function(table,entity,condition){
        return new Promise(function (resolve, reject){
            const sql = `UPDATE  ${table} SET ? WHERE ?`;
            pool.query(sql, [entity,condition],function(error, results, fields){
                if(error) {
                    return reject(error);
                }
                resolve(results);
            })
        })
    },
    delete: function(table,condition){
        return new Promise(function (resolve, reject){
            const sql = `DELETE FROM ${table}  WHERE  ? `;
            pool.query(sql, condition,function(error, results, fields){
                if(error) {
                    return reject(error);
                }
                resolve(results);
            })
        })
    }
};