// Khai báo các thư viện
const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session');
const passport = require('passport');
// var multer  =   require('multer');
// Khởi tạo express
const app = express();
require('./lib/passport');

const  db = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'blogdb',
};



// Cấu hình địa chỉ PORT
app.set('port',process.env.PORT || 3000);
app.set('views', path.join(__dirname,'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'),'layouts'),
    partialsDir: path.join(app.get('views'),'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');
// Middlewares
app.use(cookieParser('hoangnguyen'));
// config session
app.use(session({
    secret: 'hoangnguyen',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(db),
    cookie: { maxAge: 60000 }
}));
// Flash
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded( {extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


const categoryModel = require('./models/category.model');
const postModel = require('./models/post.model');
// Khai báo các biến toàn cục
app.use(async (req,res,next) => {
    const lcCategory = await categoryModel.all();
    const lcCatName = await postModel.findCatName();
    const lcpostTang = await postModel.postTang();
    const lcAllCateWithDetail = await categoryModel.allWithDetail();
    res.locals.lcCategory = lcCategory;
    res.locals.lcCatName = lcCatName;
    res.locals.lcpostTang = lcpostTang;
    res.locals.lcAllCateWithDetail = lcAllCateWithDetail;
    if(req.user !== undefined)
    {
        delete req.user.password;
        res.locals.lcuser = req.user;
    }
    next();
})


app.use('/user',require('./routers/users'));
app.use('/post',require('./routers/posts'));
app.use('/admin',require('./routers/admin'));
app.use('/',require('./routers/site'));
// Public
app.use(express.static(path.join(__dirname,'public')));

// Chạy server
app.listen(app.get('port'), () => {
    console.log('Server chạy dưới PORT ',app.get('port'));
})