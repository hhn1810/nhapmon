const pool = require('../../database');
const Handlebars = require("handlebars"); 
Handlebars.registerHelper('isNull',function(updated_at){
    if (updated_at === null)
        return true;
    return false;
})
class AdminControllers {

    // Hiển thị tất cả Category GET
    async cate(req, res){
        const category = await pool.query('SELECT * FROM category');
        res.render('admin/cate',{layout : false, category,success: req.flash('success')});
    };

    // Hiển thị giao diện thêm Category GET
    categoryAdd (req, res){
        res.render('category/add',{layout: false});
    }

    // Xử lý thêm Category POST
    async addCate(req, res) {
        const cate_name = req.body.category;
        const slug = req.body.category.toLowerCase();
        const newCategory ={
            cate_name,
            slug
        }
        await pool.query('INSERT INTO category SET ?',[newCategory]);
        req.flash('success','Thêm thành công');
        res.redirect('./');
    }
    
    // Hiển thị giao diện cập nhật Category GET
    async showupdateCate (req, res){
        console.log(req.params.id);
        const category = await pool.query('SELECT * FROM category WHERE id = ?', req.params.id );
        res.render('category/update',{layout: false,category: category[0]});
    }

    // Xử lý cập nhật Category POST
    async updateCate(req, res){
        const { id } = req.params;
        const cate_name = req.body.category;
        await pool.query('UPDATE category SET cate_name = ?,updated_at = CURRENT_TIMESTAMP WHERE id = ?',[cate_name,id]);
        req.flash('success','Cập nhật thành công');
        res.redirect('../');
    }

    // Xử lý xóa Category POST
    async delCate(req, res) {
        const id = req.params.id;
        await pool.query('DELETE FROM category WHERE id = ?', id ,function(err){
            if(err){
                console.log(err);
            }
            req.flash('success','Xóa Thành Công');
            res.redirect('back')
        });
    }
    
    
    upload(req, res) {
        var fs = require('fs');
        fs.readFile(req.files.upload.path, function (err, data) {
            var newPath = __dirname + '/../public/uploads/img_post' + req.files.upload.name;
            fs.writeFile(newPath, data, function (err) {
                if (err) console.log({err: err});
                else {
                    html = "";
                    html += "<script type='text/javascript'>";
                    html += "    var funcNum = " + req.query.CKEditorFuncNum + ";";
                    html += "    var url     = \"/uploads/img_post" + req.files.upload.name + "\";";
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
        const users = await pool.query('SELECT * FROM users WHERE role = ?', 'Author');
        res.render('admin/index',{layout : false, users});
    };
    async delUser(req, res) {
        const id = req.params.id;
        await pool.query('DELETE FROM users WHERE id = ?', id );
        res.redirect('back');
    }
    
    
}

module.exports = new AdminControllers();