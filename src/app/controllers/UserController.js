const pool = require('../../database');
const bcrypt = require('bcryptjs');

const { emailValidation } = require('../../lib/validator');
const Handlebars = require("handlebars"); 

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

    // // Tạo User mới => POST
    // async registerUser(req, res){
    //     const email = req.body.email;
    //     const username = req.body.username;
    //     const password = req.body.pass;
    //     const repassword = req.body.repass;
    //     const { error } = registerValidation({username,email,password,repassword});
    //     const usernameExist = await pool.query('SELECT username FROM users WHERE username = ? ',username);
    //     if(error) {
    //         const err = error.details[0].message;
    //         res.render('users/signup',{layout : false,err,email,username,password,repassword});      
    //     }
    //     else if(password !== repassword){
    //         res.render('users/signup',{layout : false,err: 'Mật Khẩu Nhập Lại Không Khớp',email,username,password,repassword});
    //     }
    //     else if(usernameExist.length >=1){
    //         res.render('users/signup',{layout : false,err: 'Tài Khoản Đã Tồn Tại',email,username,password,repassword});
    //     }
    //     else{
    //         let newUser ={
    //                 username: username,
    //                 email:email,   
    //                 password:password
    //             };
    //             bcrypt.genSalt(10, function(err, salt){
    //                 bcrypt.hash(newUser.password, salt, function(err, hash){
    //                   if(err){
    //                     console.log(err);
    //                   }
    //                   newUser.password = hash;
    //                   pool.query('INSERT INTO users SET ?',newUser);
    //                   res.render('users/login',{layout : false,message: "Đăng ký thành công"});
    //                 });
    //               });
    //     }
    // }
    
    // Tạo Trang Đăng Nhập => GET
    getLoginPage(req,res) {
        res.render('users/login',{layout : false,error: req.flash('error')});
    }
    
    async loginUser(req,res) {
        
        const username = req.body.username;
        const pass= req.body.password;
        const user = await pool.query('SELECT * FROM users WHERE username = ? ',username);
        
        if(user < 1){
            res.render('users/login',{layout : false,err: 'Tài Khoản Không Tồn Tại'});
        }
        
        else{
            const correctPass = bcrypt.compareSync(pass, user[0].password);
            console.log(correctPass);
            if(correctPass === false){
                res.render('users/login',{layout : false,err: 'Sai Mật Khẩu'});
            }
            else {
                res.json(user[0]);
            }
        } 
    }
    async showupdateEmail(req, res){
        const users = await pool.query('SELECT * FROM users WHERE id = ?', req.params.id );
        res.render('users/update-email',{layout: false,users: users[0]});
    }
    async updateEmail(req, res) {
        const { id } = req.params;
        const email = req.body.email;
        const {error} = emailValidation({email});
        if(error){
            const err = error.details[0].message;
            const users = await pool.query('SELECT * FROM users WHERE id = ?', req.params.id );
            res.render('users/update-email',{layout: false,users: users[0],err: err });
        }
        else{
            await pool.query('UPDATE users SET email = ? WHERE id = ?',[email,id]);
            const users = await pool.query('SELECT * FROM users WHERE id = ?', req.params.id );
            res.render('users/profile',{layout: false,users: users[0]});
        }
    }
    // async showprofile(req, res){
    //     const users = await pool.query('SELECT * FROM users WHERE id = ?', req.params.id );
    //     res.render('users/profile',{layout: false,users: users[0]});
    // }
    async showupdatePassword(req, res){
        const users = await pool.query('SELECT * FROM users WHERE id = ?', req.params.id );
        res.render('users/update-password',{layout: false,users: users[0]});
    }

}

























module.exports = new UserControllers();