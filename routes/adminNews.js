var express = require('express');
var router = express.Router();
var moment = require('moment-timezone');
var multer  = require('multer'); //sử dụng thư viện multer để up ảnh
var fs = require('fs')
var ModelNews =require('../models/News');
var ModelProducts =require('../models/Product');
var Product_Category = require('../models/productCategory')
var commentsModel = require('../models/comments')



// Kết thúc sử dụng mongoose để connect tới mongoDB

/* GET trang thêm tin tức. */
router.get('/admin/add_News', function(req, res, next) {

        res.render('./admin/add_News'); 
});

/* GET trag xem danh sách tin tức. */
router.get('/admin/adminNews/:page', function(req, res, next) {
  var perPage = 12; /* perPage - số dòng dữ liệu trên mỗi trang */
  var page = req.params.page || 1; /* page - biến chứa số trang hiện tại (Lấy từ request) */
  ModelNews.find({})
  .skip((perPage * page) - perPage) /* mỗi trang chúng ta cần phải bỏ qua ((perPage * page) - perPage) giá trị (trên trang đầu tiên giá trị của bỏ qua phải là 0): */
  .limit(perPage)
  .exec(function(err,dataNews) { 
    ModelNews.count().exec(function(err, count) { /* dùng count để tính số trang */
          if (err) throw err;
          res.render('./admin/adminNews', { /* hiển thị và gửi dữ liệu đi kèm */
             data:dataNews,
              moment,
              current: page,
              pages: Math.ceil(count / perPage)
            
          }); 
      });
  });

});


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './image_TinTuc')
  },
  filename: function (req, file, cb) {
    cb(null,Date.now()+ '-' + file.originalname );
  }
})
var upload = multer({ storage: storage })


/* Upload file ảnh. */
router.post('/uploadfile',upload.any(), function(req, res, next) {
  res.status(200).send(req.files);
});


/*---------------------Upload ảnh trong CKEDitor--------------------------------*/

router.get('/admin/add_News', function (req, res) {
  var title = "Plugin Imagebrowser ckeditor for nodejs"
  res.render('./admin/add_News', { result: 'result' })
})
//show all image in folder upload to json
router.get('/files', function (req, res) {
  const images = fs.readdirSync('./image_TinTuc')
  
  var sorted = []
  for (let item of images){
      if(item.split('.').pop() === 'png'
      || item.split('.').pop() === 'jpg'
      || item.split('.').pop() === 'jpeg'
      || item.split('.').pop() === 'svg'){
          var abc = {
                "image" : "/image_TinTuc/"+item,
                "folder" : '/'
          }
          sorted.push(abc)
      }
  }
  res.send(sorted);
})
//upload image to folder upload
router.post('/upload', upload.array('flFileUpload', 12), function (req, res, next) {
    res.redirect('back')
});

//delete file
router.post('/delete_file', function(req, res, next){
  var url_del = 'public' + req.body.url_del
  console.log(url_del)
  if(fs.existsSync(url_del)){
    fs.unlinkSync(url_del)
  }
  res.redirect('back')
});
/*-----------------End Upload ảnh trong CKEDitor------------------------*/

/* Xóa dữ liệu. */
router.get('/admin/xoa/:idcanxoa/:page', function(req, res, next) {
    var id =req.params.idcanxoa;
    var a=req.params.page;
     ModelNews.findByIdAndRemove(id).exec();
     commentsModel.find({ postId:id }).remove().exec();
    res.redirect('/admin/adminNews/'+a); //điều hướng tới trang adminNews
   
  });



/* Post trang up sản phẩm . */ 
router.post('/UpNews', function(req, res, next) {
    var title_news_intro=req.body.title_news_intro,
        content_News_intro=req.body.editor1,
        image_News = req.body.files + '';
        
      
    //định nghĩa một đối tượng để insert
    var motdoituong={
        "image_News":image_News.split(',').filter(i => i),
        "title_news_intro":title_news_intro,
        "content_News_intro":content_News_intro
       
    }
    var dataNews=new ModelNews(motdoituong);
    dataNews.save();//hàm lưu dữ liệu
    req.flash('success_msg', 'Thêm tin tức thành công!');
    res.redirect('/admin/add_News');    //điều hướng tới trang admin 
    console.log("dữ liệu thêm vào:"+dataNews)
 });

 /* get dữ liệu về để Sửa dữ liệu. */
router.get('/admin/Edit_News/:idcansua/:page', function(req, res, next) { //chú ý: lấy từ đường dẫn thì dùng params
    var id2 = req.params.idcansua;
    var a = req.params.page;
    ModelNews.find({_id : id2},function(err,dataNews){
    res.render('./admin/editNews',{title:"sửa dữ liệu",dataNews:dataNews,a:a});
    console.log("data lấy về sau khi sữa:"+dataNews);
    })
});

/*Post Sửa dữ liệu đã sửa. */
router.post('/admin/Edit_News/:idcansua/:page', function(req, res, next) { //chú ý: lấy từ đường dẫn thì dùng params
      var id2 = req.params.idcansua; 
      var a = req.params.page; 
      image_News =  req.body.files +'';
      ModelNews.findById(id2,function(err,dataNews){
        dataNews.image_News=image_News.split(',').map(s => s.trim()).filter(i => i);//mảng ảnh sản phẩm
        dataNews.title_news_intro = req.body.title_news_intro;
        dataNews.content_News_intro = req.body.editor1;  //lấy từ form thì dùng body
        dataNews.save();
        req.flash('success_msg', 'Sửa tin tức thành công!');
        res.redirect('/admin/adminNews/'+a);
        console.log("dữ liệu sau khi sửa:"+dataNews);
   });
    
});

module.exports = router;