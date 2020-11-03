module.exports = {
    isLoggedIn (req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        return res.redirect('/user/login');
    },
    isAdmin (req, res, next) {
        if (req.isAuthenticated() && req.user.role =="Admin") {
            return next();
        }
        return res.redirect('/user/login');
    }
};