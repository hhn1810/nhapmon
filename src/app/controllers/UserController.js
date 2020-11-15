const { emailValidation } = require('../../lib/validator');
const Handlebars = require("handlebars"); 
const userModel = require('../../models/user.model');
const commentModel = require('../../models/comment.model');
Handlebars.registerHelper('isdefined', function (value) {
    if (typeof value !== undefined)
        return false;
    return true;

  });
class UserControllers {

    // Tạo trang đăng ký => GET
    getRegisterPage(req,res) {
        res.render('users/signup',{layout : false,error: req.flash('error')});
    }
    
    // Tạo Trang Đăng Nhập => GET
    getLoginPage(req,res) {
        res.render('users/login',{layout : false,error: req.flash('error')});
    }
    
    showupdateEmail(req, res){
        const user = req.user;
        res.render('users/update-email',{layout: false,user});
    }
    async updateEmail(req, res) {
        const { id } = req.params;
        const email = req.body.email;
        const {error} = emailValidation({email});
        if(error){
            const err = error.details[0].message;
            const users = await userModel.single(res.params.id);
            res.render('users/update-email',{layout: false,users: users[0],err: err });
        }
        else{
            const newEmailUser = {
                id,
                email
            }
            await userModel.update(newEmailUser);
            res.redirect('/user/profile');
        }
    }
    // async showprofile(req, res){
    //     const users = await pool.query('SELECT * FROM users WHERE id = ?', req.params.id );
    //     res.render('users/profile',{layout: false,users: users[0]});
    // }
    async showupdatePassword(req, res){
        res.render('users/update-password',{layout: false,user: req.user});
    }
    async comment(req, res){
        const newComment = {
            user_id: req.user.id,
            post_id: req.params.id,
            comment: req.body.message
        }
        await commentModel.addComment(newComment);
        req.flash('comment','Bình Luận Thành Công');
        res.redirect('back');
    };

}

























module.exports = new UserControllers();