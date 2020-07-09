var express = require('express');
var router = express.Router();
var ModelNews =require('../models/News');
var moment = require('moment-timezone');
var Product_Category = require('../models/productCategory')
var ejs = require('ejs')
var bodyParser = require('body-parser')
var app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))
app.set('view engine', 'ejs')
//sử dụng mongoose để connect tới mongoDB
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/MyDatabase', {useMongoClient: true}); /*/MyDatabase là tê của  database mà ta đã tạo bên CSDL mongo*/

/* GET trang Điểm Tin. */
router.get('/diemtin/:page',  function(req, res, next) {
  var perPage = 9; /* perPage - số dòng dữ liệu trên mỗi trang */
  var page = req.params.page || 1; /* page - biến chứa số trang hiện tại (Lấy từ request) */
  ModelNews.find({})
  .skip((perPage * page) - perPage) /* mỗi trang chúng ta cần phải bỏ qua ((perPage * page) - perPage) giá trị (trên trang đầu tiên giá trị của bỏ qua phải là 0): */
  .limit(perPage)
  .exec(function(err, data) { 
    ModelNews.count().exec(function(err, count) { /* dùng count để tính số trang */
          if (err) throw err;
          Product_Category.find({},function(err,dataBrand){   
          res.render('DiemTin', { /* hiển thị và gửi dữ liệu đi kèm */
              dataNews:data,
              dataBrand:dataBrand,
              moment,
              current: page,
              pages: Math.ceil(count / perPage)
            }); 
          }); 
      });
  });
});

 /* get dữ liệu về để xem dữ liệu chi tiết bản tin. */
 router.get('/detail/:idcansua', function(req, res, next) { //chú ý: lấy từ đường dẫn thì dùng params
  var id2 = req.params.idcansua;
  ModelNews.find({_id : id2},function(err,dataNews){
    Product_Category.find({},function(err,dataBrand){ 
    res.render('DiemTin_detail',{title:"sửa dữ liệu",dataNews:dataNews, dataBrand:dataBrand, moment});
  })
  })
});


module.exports = router;

router.get('/profile', function(req, res){
  res.render('profile', {user: req.user})
})
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect('users/login')
}

