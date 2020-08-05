var express = require('express');
var router = express.Router();
var ModelNews =require('../models/News');
var moment = require('moment-timezone');
var Product_Category = require('../models/productCategory')
var ejs = require('ejs')
var bodyParser = require('body-parser')
var app = express()
var commentsModel = require('../models/comments')
var commentreplyModel = require('../models/replycomment')
var ModelProducts =require('../models/Product');


/* GET trang list sản phẩm và brand. */
router.get('/brandandproduct/:id/:page',  function(req, res, next) {
    /* search suggestion */
    var list_Alldata_search=[];
    ModelProducts.find().then((memess) => {
    memess.forEach((document) => {
      list_Alldata_search.push(document.product_name)  
    });
  });
  ModelNews.find().then((memes) => {
    memes.forEach((document) => {
      list_Alldata_search.push(document.title_news_intro)   
    });    
  });
 /* end search suggestion */
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
           console.log("dataXXX:"+data ) 
           res.render('brandAndproduct', { /* hiển thị và gửi dữ liệu đi kèm */
               data:data,
               dataBrand:dataBrand,
               moment,
               current: page,
               list_Alldata_search:list_Alldata_search,
               pages: Math.ceil(count / perPage)
             }); 
           }); 
       });
   });
 });
  
 router.get('/profile',isLoggedIn, function(req, res,next){
   Product_Category.find({},function(err,dataBrand) {
            res.render('profile',{ dataBrand:dataBrand, user: req.user, isLoggedIn: req.isLogged });
      })
 })
 
 function isLoggedIn(req, res, next){
   if(req.isAuthenticated()){
     req.isLogged = true
     return next()
   }
   res.redirect('users/login')
 }

 module.exports = router;
 
 