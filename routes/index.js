var express = require('express');
var router = express.Router();
var fs = require('fs')
var multer1 = require('multer');//sử dụng thư viện time zone để up ảnh
var moment = require('moment-timezone');
var faker = require('faker')
var ModelProducts =require('../models/Product');
var Product_Category = require('../models/productCategory');
var ModelNews =require('../models/News');


//sử dụng mongoose để connect tới mongoDB
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/MyDatabase', {useMongoClient: true}); /*/MyDatabase là tê của  database mà ta đã tạo bên CSDL mongo*/

/* GET home page. */
router.get('/', function(req, res, next) {
  Product_Category.find({},function(err,dataBrand){
      ModelProducts.find({},function(err,dataProduct){
          ModelNews.find({},function(err,dataNews){
            res.render('index',{ dataProduct:dataProduct,  dataBrand:dataBrand,  dataNews:dataNews,  moment});
          })
      })
  })
});


/* GET trang list sản phẩm và brand. */
router.get('/brandandproduct/:id/:page',  function(req, res, next) {
  var id= req.params.id;
  var perPage = 9; /* perPage - số dòng dữ liệu trên mỗi trang */
  var page = req.params.page || 1; /* page - biến chứa số trang hiện tại (Lấy từ request) */
  ModelProducts.find({id_category:id})
  .skip((perPage * page) - perPage) /* mỗi trang chúng ta cần phải bỏ qua ((perPage * page) - perPage) giá trị (trên trang đầu tiên giá trị của bỏ qua phải là 0): */
  .limit(perPage)
  .exec(function(err, data) { 
    ModelProducts.find({id_category:id}).count().exec(function(err, count) { /* dùng count để tính số trang */
          if (err) throw err;
          Product_Category.find({},function(err,dataBrand){   
          res.render('brandAndproduct', { /* hiển thị và gửi dữ liệu đi kèm */
              data:data,
              dataBrand:dataBrand,
              moment,
              current: page,
              pages: Math.ceil(count / perPage)
            }); 
          }); 
      });
  });
});





router.get('/profile', function(req, res){
  res.render('profile', {user: req.user})
})
module.exports = router;
function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    return next()
  }
  res.redirect('users/login')
}
