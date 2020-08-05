var express = require('express');
var router = express.Router();
var fs = require('fs')
var multer1 = require('multer');//sử dụng thư viện time zone để up ảnh
var moment = require('moment-timezone');
var faker = require('faker')

var Product_Category = require('../models/productCategory');
var commentsModel = require('../models/comments')
var commentreplyModel = require('../models/replycomment')
var Order = require('../models/Order')
var User = require('../models/User');
var ModelNews =require('../models/News');
var ModelProducts =require('../models/Product');
var Feedbacks =require('../models/Feedback');
const { render } = require('../app');



/* GET home page. */
router.get('/', function(req, res, next) {
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
  Product_Category.find({},function(err,dataBrand){
      ModelProducts.find({},function(err,dataProduct){
          ModelNews.find({},function(err,dataNews){
            res.render('index',{ dataProduct:dataProduct,  dataBrand:dataBrand,  dataNews:dataNews,  moment,list_Alldata_search:list_Alldata_search});
          })
      })
  })
});


// day la trang thong tin nguoi dung
router.get(('/profile'),isLoggedIn, function(req, res,next){
  Product_Category.find({},function(err,dataBrand) {
    Order.find({id_customer: req.user._id, completed: 0}, function(err, ordersHandling){
      Order.find({id_customer: req.user._id, completed: 1}, function(err, ordersCompleted){
        Order.find({id_customer: req.user._id, completed: 1}).count(function(err, numberCompleted){
          Order.find({id_customer: req.user._id, completed: 0}).count(function(err, numberHandling){
            res.render('profile',{ dataBrand:dataBrand, user: req.user, ordersHandling, ordersCompleted , numberCompleted, numberHandling});
          }) 
        })
      })
    }) 
  })
})
//thay doi thong tin ng dung
router.post('/changeinfo', function(req, res){
  Product_Category.find({},function(err,dataBrand) {
    const {Name, Email, Phone, Address} = req.body;
    User.updateOne({_id:String(req.user.id)},{Name:Name, Email:Email, Phone:Phone, Address:Address}, function(err){
      User.findOne({_id:String(req.user.id)},function(err,data){
        req.user = data;
        console.log(data)
        res.redirect('/profile')
      })
      
      
    })
    
  })
})
//danh gia
router.post("/feedback", function(req, res){
  const newFeedback = new Feedbacks({
    "id_order":req.body.idOrder,
    "rate": req.body.rating,
    "feedbacks": req.body.feedbacks
  })
  newFeedback.save()
  .then(feedback => {
    Order.updateOne({_id: req.body.idOrder},{completed_feedback: 1}, function(err){
      if(err)
      {
        console.log(err)
      }
      else{
        res.redirect('/chitietdonhang/'+req.body.idOrder)
      }
    })
  })
})
//sua danh gia /changefeedback
router.post('/changefeedback', function(req, res){
  const newFeedback = new Feedbacks({
    "id_order":req.body.idOrder,
    "rate": req.body.rating,
    "feedbacks": req.body.feedbacks
  })
  Feedbacks.updateOne({id_order: req.body.idOrder }, {rate: req.body.rating, feedbacks:req.body.feedbacks}, function(err){
    res.redirect('/chitietdonhang/'+req.body.idOrder)
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

