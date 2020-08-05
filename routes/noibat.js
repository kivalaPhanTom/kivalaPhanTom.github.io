
var express = require('express');
var router = express.Router();
var moment = require('moment-timezone');
var Product_Category = require('../models/productCategory')
var commentsModel = require('../models/comments')
var commentreplyModel = require('../models/replycomment')
var ModelNews =require('../models/News');
var ModelProducts =require('../models/Product');
/*--------------------------------------------Xử lý phần comment--------------------------------------*/
router.get('/deleteComment/:commentId/:postId', function(req, res, next) { /* xóa comment */
  var commentId = req.params.commentId,
      postId = req.params.postId; 
      console.log('commentId:',commentId);
      commentsModel.findByIdAndRemove(commentId).exec();
      commentreplyModel.find({comment_parent_id:commentId }).remove().exec(); /*xóa bình luận cha thì bình luận con trong nó cũng bị xóa theo */
      res.redirect('/detailPR/'+postId); 
 
});
/* Post trang up thêm comment . */
router.post('/comment/:postId', function(req, res, next) {
  var postId = req.params.postId,
      userID = req.body.userID,
      nameUser = req.body.nameUser,
      textArea_comment = req.body.textArea_comment;
  //định nghĩa một đối tượng để insert
  var motdoituong={
    'comment' :textArea_comment,    
    'postId' :postId,
    'userId':userID,
    'nameUser':nameUser,
  }
  var dataComment = new commentsModel(motdoituong);
     dataComment.save();//hàm lưu dữ liệu
     res.redirect('/detailPR/'+postId)
});

/*Post Sửa nội dung comment. */
router.post('/editComment/:idcomment/:postId', function(req, res, next) { //chú ý: lấy từ đường dẫn thì dùng params
  var id =req.params.idcomment;
  var postId=req.params.postId;
    commentsModel.findById(id,function(err,dataComment){
          dataComment.comment = req.body.text_edit_comment;
          dataComment.save();
          res.redirect('/detailPR/'+postId);
         
          console.log("data:"+dataComment);
    });
});

/*------End ----Xử lý phần comment--------------------------------------*/

/*------------------------------------------Reply -Xử lý phần comment--------------------------------------*/
router.get('/deleteCommentReply/:commentReplyId/:postId', function(req, res, next) { /* xóa reply comment */
  var commentReplyId = req.params.commentReplyId,
      postId = req.params.postId; 
      commentreplyModel.findByIdAndRemove(commentReplyId).exec();
      res.redirect('/detailPR/'+postId); 
 
});
/* Post trang up thêm Reply comment . */
router.post('/Replycomment/:parentCommentId/:postId', function(req, res, next) {
  var postId = req.params.postId,
      parentCommentId= req.params.parentCommentId,
      userReplyID = req.body. userReplyID,
      nameUserReply= req.body. nameUserReply,
      textArea_Reply = req.body.textArea_Reply;

  //định nghĩa một đối tượng để insert
  var motdoituong={
    'comment_reply':textArea_Reply,   
    'comment_parent_id':parentCommentId, 
    'postId' :postId,
    'userId_reply':userReplyID,
    'nameUser_reply':nameUserReply,
  }
  var dataCommentReply = new commentreplyModel(motdoituong);
     dataCommentReply.save();//hàm lưu dữ liệu
     res.redirect('/detailPR/'+postId)

});
/*Post Sửa nội dung reply comment. */
router.post('/editCommentReply/:idcommentReply/:postId', function(req, res, next) { //chú ý: lấy từ đường dẫn thì dùng params
  var id =req.params.idcommentReply;
  var postId=req.params.postId;
    commentreplyModel.findById(id,function(err,dataCommentReply){
        dataCommentReply.comment_reply = req.body.text_edit_commentReply;
        dataCommentReply.save();
          res.redirect('/detailPR/'+postId);

    });
});
/*-------End-----Reply -Xử lý phần comment--------------------------------------*/

/* GET trang Mới nhất (nổi bật). */
router.get('/noibat/:page',  function(req, res, next) {
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
  var perPage = 9; /* perPage - số dòng dữ liệu trên mỗi trang */
  var page = req.params.page || 1; /* page - biến chứa số trang hiện tại (Lấy từ request) */

  ModelProducts.find({Top:'Có'})
  .skip((perPage * page) - perPage) /* mỗi trang chúng ta cần phải bỏ qua ((perPage * page) - perPage) giá trị (trên trang đầu tiên giá trị của bỏ qua phải là 0): */
  .limit(perPage)
  .exec(function(err, data) { 
    ModelProducts.find({Top:'Có'}).count().exec(function(err, count) { /* dùng count để tính số trang */
          if (err) throw err;
          Product_Category.find({},function(err,dataBrand){  
            res.render('NoiBat', { /* hiển thị và gửi dữ liệu đi kèm */
              dataProductHot:data, 
              dataBrand:dataBrand,
              moment,
              current: page,
              list_Alldata_search:list_Alldata_search,
              pages: Math.ceil(count / perPage) }); 
            
            });  
         });
     });
});


 
/* get dữ liệu về để xem dữ liệu chi tiết bản tin. */
router.get('/detailPR/:idcansua', function(req, res, next) { //chú ý: lấy từ đường dẫn thì dùng params
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
  var id2 = req.params.idcansua;
  ModelProducts.find({_id : id2},function(err,dataProductHot){
    Product_Category.find({},function(err,dataBrand) { 
      commentsModel.find({},function(err,dataComment) {
        commentreplyModel.find({},function(err,dataCommentReply) {

    res.render('ChiTiet',{moment, data:dataProductHot, dataBrand:dataBrand, user:req.user, isLoggedIn:req.isLogged, postId:id2, dataComment:dataComment,dataCommentReply:dataCommentReply,list_Alldata_search:list_Alldata_search });
                  })
               })
         
            })
 
        })
});




function isLoggedIn(req, res, next){
  if(req.isAuthenticated()){
    req.isLogged = true
    return next()
  }
  res.redirect('users/login')
}
module.exports = router;

