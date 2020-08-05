var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport = require('passport')
var indexRouter = require('./routes/index'); // trang chu
var usersRouter = require('./routes/users'); // user function truyen thong
var cartRouter = require('./routes/cart'); //route gio hang
var adminRouter = require('./routes/admin'); //route admin san pham + brand
var authRouter = require('./routes/auth');// chung thuc facebook google
var diemtin=require('./routes/diemtin'); /*noibat ở đây chính là file  diemtin.js ở Router*/
var adminNews=require('./routes/adminNews'); /*adminNews ở đây chính là file adminNews.js ở Router*/
var noibat=require('./routes/noibat'); /*noibat ở đây chính là file  noibat.js ở Router*/
var search=require('./routes/search'); /*search ở đây chính là file  search.js ở Router*/
var brandAndproduct=require('./routes/brandAndproduct'); /*brandAndproduct ở đây chính là file  brandAndproduct.js ở Router*/

var giamgia=require('./routes/giamgia'); /*noibat ở đây chính là file  noibat.js ở Router*/
var session = require('express-session')
var app = express();
var mongoose = require('mongoose');
var flash = require('connect-flash'); 
var MongoStore = require('connect-mongo')(session)
//connect DB
mongoose.set("useNewUrlParser", true);
//database
mongoose.connect('mongodb://localhost:27017/MyDatabase')
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error!"));
db.once("open", function(){
    console.log("Ket nois DB thanh cong!!")
})
// passport config
require('./config/passport')(passport);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//session
app.use(session({
  secret : 'secret',
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: mongoose.connection}),
  cookie:{ maxAge: 180 * 60 * 1000}
}));
// passport middleware
app.use(passport.initialize());
app.use(passport.session());
// connect flash
app.use(flash());
// global vars 
app.use((req, res, next) =>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error'); 
  res.locals.login = req.isAuthenticated()
  res.locals.user = req.user;
  res.locals.session = req.session;
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use('/image_TinTuc', express.static('image_TinTuc'));/* khai báo đường dẫn chứa ảnh */
app.use('/image_Product', express.static('image_Product'));/* khai báo đường dẫn chứa ảnh sản phẩm */
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/', cartRouter);
app.use('', adminRouter);
app.use('/auth', authRouter);
app.use('',diemtin); /*diemtin chính là biến diemtin bên trên */
app.use('',adminNews); /*adminNews chính là biến adminNews bên trên */
app.use('', noibat); /* noibat chính là biến noibat bên trên */
app.use('',giamgia); /*giamgia chính là biến giamgia bên trên */
app.use('', search); /* search chính là biến search bên trên */
app.use('',brandAndproduct);/*brandAndproduct chính là biến brandAndproduct bên trên */

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  return res.locals.message = err.message;
  return res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  return res.status(err.status || 500);
  return res.render('error');
});

module.exports = app;
