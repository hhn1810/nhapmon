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
        res.render('single_post',{soLuong: soLuong[0],comments:message,post: post[0],comment: req.flash('comment')});
    }
    async showCate (req, res){
        const page = + req.query.page || 1;
        if (page<0) page=1;
        const limit =2;
        const offset = (page - 1 ) * limit;
        const slug = req.params.slug;
        const cate= await cateModel.allWhere('slug',slug);
        const firstPost = await pool.query('SELECT * FROM posts WHERE cate_id = ? limit 1',[cate[0].id]);
        const post = await postModel.pageByCat(cate[0].id,limit,offset);
        const total = await postModel.countByCat(cate[0].id);
        const nPages = Math.ceil(total/limit);
        const page_items = [];
        for (let i = 1; i <= nPages; i++) {
            const item = {
                value: i
            };
            page_items.push(item);
        }
        console.log(page,nPages)
        res.render('category_post',{
            cate: cate[0],
            post,
            firstPost: firstPost[0],
            prev_value: page - 1,
            next_value: page + 1,
            can_go_prev: page > 1,
            can_go_next: page < nPages
        });
    }
}

module.exports = new SiteControllers();
