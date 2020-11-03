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
const validator = require('express-validator');
// var multer  =   require('multer');
// Khởi tạo express
const app = express();
require('./lib/passport');

var  db= {
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




// Khai báo các biến toàn cục
app.use((req,res,next) => {
    next();
})


app.use('/user',require('./routers/users'));
app.use(require('./routers/posts'));
app.use('/admin',require('./routers/admin'));
app.use('/',require('./routers/site'));
// Public
app.use(express.static(path.join(__dirname,'public')));

// Chạy server
app.listen(app.get('port'), () => {
    console.log('Server chạy dưới PORT ',app.get('port'));
})