const pool = require('../../database');
const Handlebars = require("handlebars"); 
const categoryModel = require('../../models/category.model');
const userModel = require('../../models/user.model');
const postModel = require('../../models/post.model');
const commentModel = require('../../models/comment.model');
const fs = require("fs");
var fastcsv = require("fast-csv");
Handlebars.registerHelper('isNull',function(updated_at){
    if (updated_at === null)
        return true;
    return false;
})
function removeAccents(str) {
    return str.normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .replace(/đ/g, 'd').replace(/Đ/g, 'D');
  }
class AdminControllers {

    // Hiển thị tất cả Category GET
    async cate(req, res){
        const category = await categoryModel.all();
        res.render('category/index',{layout : false,category,success: req.flash('success')});
    };

    // Hiển thị giao diện thêm Category GET
    categoryAdd (req, res){
        res.render('category/add',{layout: false});
    }

    // Xử lý thêm Category POST
    async addCate(req, res) {
        const cate_name = req.body.category;
        const slug = req.body.category.toLowerCase();
        const cate = await categoryModel.allWhere('cate_name',cate_name);
        if(cate[0]=== undefined){
            const newCategory ={
                cate_name,
                slug
            }
            await categoryModel.add(newCategory);
            req.flash('success','Thêm thành công');
            res.redirect('./');
        }
        else{
            req.flash('success',`Danh Mục ${cate_name} đã tồn tại`);
            res.redirect('./');
        }
        }
        
    
    // Hiển thị giao diện cập nhật Category GET
    async showupdateCate (req, res){
        const id = req.params.id;
        const category = await categoryModel.single(id);
        res.render('category/update',{layout: false,category: category[0]});
    }

    // Xử lý cập nhật Category POST
    async updateCate(req, res){
        const { id } = req.params;
        const cate_name = req.body.category;
        console.log(cate_name);
        const slug = req.body.category.toLowerCase();
        const cate = await categoryModel.allWhere('cate_name',cate_name);
        if(cate[0]=== undefined){
            const newCategory ={
                id,
                cate_name,
                slug,
            }
            await categoryModel.update(newCategory);
            req.flash('success','Cập nhật thành công');
            res.redirect('../');
        }
        else{
            req.flash('success',`Danh Mục ${cate_name} đã tồn tại`);
            res.redirect('../');
        }
       
    }

    // Xử lý xóa Category POST
    async delCate(req, res) {
        const id = req.params.id;
        await categoryModel.delete(id);
        req.flash('success','Xóa Thành Công');
        res.redirect('back');
    }
    
    
    upload(req, res) {
        var fs = require('fs');
        fs.readFile(req.files.upload.path, function (err, data) {
            
            var newPath = 'D:\\Blog-Nodejs-Express-Mysql\\src\\public\\uploads\\' + req.files.upload.name;
            fs.writeFile(newPath, data, function (err) {
                if (err) console.log({err: err});
                else {
                    var html = "";
                    html += "<script type='text/javascript'>";
                    html += "    var funcNum = " + req.query.CKEditorFuncNum + ";";
                    html += "    var url     = \"/uploads/" + req.files.upload.name + "\";";
                    html += "    var message = \"Ảnh đã được tải lên\";";
                    html += "";
                    html += "    window.parent.CKEDITOR.tools.callFunction(funcNum, url, message);";
                    html += "</script>";
                    res.send(html);
                }
            });
        });
    }
    // BÊN USER 
    async user(req, res){
        const users = await userModel.allWhere('role','Author');
        res.render('admin/index',{layout : false, users,success: req.flash('successAdmin'),message: req.flash('success')});
    };
    async delUser(req, res) {
        const id = req.params.id;
        await userModel.delete(id);
        req.flash('success','Xóa Thành Công ');
        res.redirect('back');
    }
    //  POST

    async post(req, res){
        const post = await postModel.findCatName(); 
        res.render('post/index',{layout : false, post,success: req.flash('success')});
    }
    getaddPost(req, res){
        res.render('post/add',{layout : false,msg: req.flash('message')});
    }
    async getupdatePost(req, res){
        const post = await postModel.allWhere('id',req.params.id);
        res.render('post/update',{layout : false,msg: req.flash('message'),post: post[0]});
    }
    async addPost(req, res){
        const content = req.body.content;
        const cate_id = req.body.cate;
        const name_post = req.body.name_post;
        const title = req.body.title;
        console.log(req.body);
        const image = req.file.filename;
        var chuoi = removeAccents(name_post);
        chuoi = chuoi.toLowerCase().split(' ');
        var length = chuoi.length;
        var slug ='';
        for(var i=0; i<length;i++)
        {
            if(i===length-1)
            {
                slug+=chuoi[i];
            }
            else{
                slug += chuoi[i] + '-';
            }
        }
        let check = await postModel.allWhere('name_post',name_post);
        if(check < 1){
            const newPost = {
                cate_id,
                name_post,
                title,
                slug,
                image,
                content       
            }
            await postModel.add(newPost);
            req.flash('success','Thêm thành công');
            res.redirect('../post');
        }
        else{
            req.flash('message','Tên Post Không Được Trùng');
            res.redirect('add');
        }
    }
    async updatePost(req, res){
        const id = req.params.id;
        const {name_post,cate_id,title,content} = req.body;
        var chuoi = removeAccents(name_post);
        chuoi = chuoi.toLowerCase().split(' ');
        var length = chuoi.length;
        var slug ='';
        for(var i=0; i<length;i++)
        {
            if(i===length-1)
            {
                slug+=chuoi[i];
            }
            else{
                slug += chuoi[i] + '-';
            }
        }
        if(req.file !== undefined){
            const image = req.file.filename;
            const newPost = {
                id,
                cate_id,
                name_post,
                title,
                slug,
                image,
                content
            }
            await postModel.update(newPost);
            req.flash('success','Cập Nhật Thành Công');
            res.redirect('../');
        }
        else{
            const newPost = {
                id,
                cate_id,
                name_post,
                title,
                slug,
                content
            }
            await postModel.update(newPost);
            req.flash('success','Cập Nhật Thành Công');
            res.redirect('../');
            
        }
        
    }
    async delPost (req, res){
        const id = req.params.id;
        await postModel.delete(id);
        req.flash('success','Xóa Thành Công ');
        res.redirect('back');
    }

    // Comment 
    async comment (req, res){
        const comment = await commentModel.all();
        res.render('admin/comment',{layout : false,comment});
    }
    async delComment (req, res){
        const id = req.params.id;
        await commentModel.delete(id);
        req.flash('success','Xóa Thành Công ');
        res.redirect('back');
    }
    async thongkebaiviet(req, res){
        const post = await postModel.findCatName();
        post.forEach(element => {
            let date = element.created_at.getDate();
            let month = element.created_at.getMonth() + 1;
            let year = element.created_at.getFullYear();
            element.created_at = date + "-" + month + "-" +year;
            console.log(element.created_at);
        });
        const jsonData = JSON.parse(JSON.stringify(post));
        var ws = fs.createWriteStream("D:\\Blog-Nodejs-Express-Mysql\\src\\public\\data.csv");
        fastcsv
            .write(jsonData, { headers: true })
            .on("finish", function() {
 
                res.send("<a href='/data.csv' download='data.csv' id='download-link'></a><script>document.getElementById('download-link').click();</script>");
            })
            .pipe(ws);
    }
}

module.exports = new AdminControllers();