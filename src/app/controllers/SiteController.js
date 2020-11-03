class SiteControllers {
    // [GET] 
    index(req, res) {
        res.render('home',{user: req.user});
    }
    // [GET] /about
    about(req, res) {
        res.render('about');
    }
    contact(req, res){
        res.render('contact');
    }
}

module.exports = new SiteControllers();
