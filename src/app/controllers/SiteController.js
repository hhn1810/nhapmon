const pool = require('../../database');
const cateModel = require('../../models/category.model');
const postModel = require('../../models/post.model');
const commentModel = require('../../models/comment.model');
class SiteControllers {
    // [GET] 
    async index(req, res) {
        const postTang = await pool.query('SELECT * FROM `posts` ORDER BY created_at ASC LIMIT 5');
        const post = await pool.query('SELECT * FROM posts ');
        res.render('home',{post,postTang,user: req.user,success: req.flash('success')},);
        console.log(req.user);
    }
    // [GET] /about
    about(req, res) {
        res.render('about');
    }
    contact(req, res){
        res.render('contact');
    }
    async showPost (req, res){
        const slug = req.params.slug;
        const post= await pool.query('SELECT * FROM posts WHERE slug = ?', slug);
        const message = await commentModel.allDK(post[0].id);
        const soLuong = await commentModel.soLuong(post[0].id);
        console.log(message);
        res.render('single_post',{soLuong: soLuong[0],comments:message,post: post[0],comment: req.flash('comment')});
    }
    async showCate (req, res){
        const slug = req.params.slug;
        const cate= await cateModel.allWhere('slug',slug);
        const firstPost = await pool.query('SELECT * FROM posts WHERE cate_id = ? limit 1',[cate[0].id]);
        const post = await pool.query('SELECT * FROM posts WHERE cate_id = ? limit 100 offset 1 ',[cate[0].id]);
        res.render('category_post',{cate: cate[0],post,firstPost: firstPost[0]});
    }
}

module.exports = new SiteControllers();
