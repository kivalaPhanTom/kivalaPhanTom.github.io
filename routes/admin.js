var express = require('express');
var router = express.Router();
var fs = require('fs')
var multer1 = require('multer');//sử dụng thư viện time zone để up ảnh
var moment = require('moment-timezone');
var faker = require('faker')
var ModelProducts =require('../models/Product');
var Product_Category = require('../models/productCategory')
var Order = require('../models/Order')
var Feedback = require("../models/Feedback")
var User = require('../models/User')
var crypto = require('crypto')
var bcriptjs = require("bcryptjs")
var passport = require('passport')
var storageImageProducts = multer1.diskStorage({ //dùng multer tạo store lưu trữ ảnh product
    destination: function (req, file, cb) {
        cb(null, './image_Product')
      },
      filename: function (req, file, cb) {
        cb(null,Date.now()+ '-' + file.originalname );
      }
});
var uploadImageProducts = multer1({storage: storageImageProducts,});

/* Upload file ảnh Product. */
router.post('/uploadfileProduct',uploadImageProducts.any(), function(req, res, next) {
    res.status(200).send(req.files);
  
  });


/* GET trang Admin. */
router.get(('/admin'), isLoggedIn, function(req, res, next) {
  res.render('./admin/index')
});


/*--------------------------------------------Xử lý phần Hãng của sản phẩm--------------------------------------*/

/* GET trang thêm hãng sản phẩm */
router.get('/admin/themhang', function(req, res, next) {
  res.render('./admin/themhang');
  
});
/* get dữ liệu về để xem danh sách hãng. */
router.get('/admin/danhsachhang/:page', function(req, res, next) {

  var perPage = 12; /* perPage - số dòng dữ liệu trên mỗi trang */
  var page = req.params.page || 1; /* page - biến chứa số trang hiện tại (Lấy từ request) */
  Product_Category.find({})
  .skip((perPage * page) - perPage) /* mỗi trang chúng ta cần phải bỏ qua ((perPage * page) - perPage) giá trị (trên trang đầu tiên giá trị của bỏ qua phải là 0): */
  .limit(perPage)
  .exec(function(err,dataBrand) { 
    Product_Category.count().exec(function(err, count) { /* dùng count để tính số trang */
          if (err) throw err;
          res.render('./admin/danhsachhang', { /* hiển thị và gửi dữ liệu đi kèm */
              listBrand:dataBrand,
              moment,
              current: page,
              pages: Math.ceil(count / perPage)
            
          }); 
      });
  });
});
/* Xóa dữ liệu Brand. */
router.get('/xoaBrand/:idcanxoa/:page', function(req, res, next) {
  var id =req.params.idcanxoa;
  var a =req.params.page;
  Product_Category.findByIdAndRemove(id).exec();
  ModelProducts.find({ id_category:id }).remove().exec(); //nếu xóa hãng nào thì xóa hết lun những sản phẩm liên quan tới hãng đó
  res.redirect('/admin/danhsachhang/'+a);  
});


  
/* Post trang up thêm Brand . */
router.post('/UpLogoBrand', function(req, res, next) {
  
    var 
        category_name = req.body.category_name,
        description = req.body.description,
        image_Brand = req.body.filesBrand +'';
         
    //định nghĩa một đối tượng để insert
    var motdoituong={
      'category_name':category_name,//tên thương hiệu
      'description':description, //mô tả (nếu có) 
      'image':image_Brand.split(',').filter(i => i)  //mảng ảnh ,        
    }
    var dataBrand = new Product_Category(motdoituong);
    dataBrand.save();//hàm lưu dữ liệu
    req.flash('success_msg', 'Thêm hãng thành công!');
    res.redirect('/admin/themhang'); 

 });

   /* get dữ liệu về để Sửa dữ liệu của Hãng. */
router.get('/admin/Edit_Brand/:idcansua/:page', function(req, res, next) { //chú ý: lấy từ đường dẫn thì dùng params
    var id2 = req.params.idcansua;
    var a = req.params.page;

    Product_Category.find({_id : id2},function(err,dataBrand){
    req.flash('success_msg', 'Sửa hãng thành công!');
    res.render('./admin/edit_Brand',{title:"sửa dữ liệu",data:dataBrand,a:a});
  })
  });
  

/*Post Sửa dữ liệu HÃng của sản phẩm. */
router.post('/admin/Edit_Brand/:idcansua/:page', function(req, res, next) { //chú ý: lấy từ đường dẫn thì dùng params
  var id =req.params.idcansua;
  var a =req.params.page;
  var  image = req.body.filesBrand +'';
   
       Product_Category.findById(id,function(err, dataBrand){
          dataBrand.category_name = req.body.category_name;
          dataBrand.description = req.body.description;  //lấy từ form thì dùng body
          dataBrand.image=  image.split(',').map(s => s.trim()).filter(i => i); 
          dataBrand.save();
          res.redirect('/admin/danhsachhang/'+a);
         res.status(200).send(req.files);
         console.log("data:"+dataBrand);
});

});





/*---------------------------------------Xử lý sản phẩm------------------------------------*/


/* GET trang thêm product. */
router.get('/admin/themsanpham', function(req, res, next) {
  Product_Category.find({},function(err,databrand) {
        res.render('./admin/themsanpham',{
          listBrand:databrand
        });
      }) 
});

/* get dữ liệu về để xem danh sách sản phẩm. */
router.get('/admin/danhsachsanpham/:page', function(req, res, next) {
  var perPage = 12; /* perPage - số dòng dữ liệu trên mỗi trang */
  var page = req.params.page || 1; /* page - biến chứa số trang hiện tại (Lấy từ request) */
  ModelProducts.find({})
  .skip((perPage * page) - perPage) /* mỗi trang chúng ta cần phải bỏ qua ((perPage * page) - perPage) giá trị (trên trang đầu tiên giá trị của bỏ qua phải là 0): */
  .limit(perPage)
  .exec(function(err,dataProduct) { 
    ModelProducts.count().exec(function(err, count) { /* dùng count để tính số trang */
          if (err) throw err;
          Product_Category.find({}, function(err, Brand){
            res.render('./admin/danhsachsanpham', { /* hiển thị và gửi dữ liệu đi kèm */
              data:dataProduct,
              moment,
              current: page,
              pages: Math.ceil(count / perPage),
              listBrand: Brand
          }); 
          })
          
      });
  });
  
});

/* Xóa dữ liệu product. */
router.get('/admin/xoaProduct/:idcanxoa/:page', function(req, res, next) {
  var id =req.params.idcanxoa;
  var a=req.params.page;
  ModelProducts.findByIdAndRemove(id).exec();
  res.redirect('/admin/danhsachsanpham/'+a);    //điều hướng tới trang admin
});

/* Post trang up thêm product . */
router.post('/UpNewProduct', function(req, res, next) {
    var image_Product = req.body.filesProduct + '',
        product_name=req.body.product_name,
        description=req.body.description;
        price=req.body.price;
        promotion_price=req.body.promotion_price,
        quantity=req.body.quantity,
        id_category=req.body.id_category,
        TopOrNot=req.body.TopOrNot,
        monitor=req.body.monitor,
        camera_truoc=req.body.camera_truoc,
        camera_sau=req.body.camera_sau,
        ram=req.body.ram,
        memory=req.body.memory,
        cpu=req.body.cpu,
        gpu=req.body.gpu,
        pin=req.body.pin,
        operation=req.body.operation,
        micro_sd=req.body.micro_sd,
        origin=req.body.origin,
        year=req.body.year,
        sim=req.body.sim;
         
    //định nghĩa một đối tượng để insert
    var motdoituong={
        'product_name':product_name,//tên sản phẩm
        'description':description, //mục mô tả, dự phòng khi web mình cần mô tả gì đó thêm
        'image':image_Product.split(',').filter(i => i),//mảng ảnh sản phẩm
        'price': price,//giá 
        'promotion_price':promotion_price, //giá khuyến mãi
        'quantity':quantity,//số lượng
        'id_category':id_category,//sản phẩm này thuộc loại nào
        'Top':TopOrNot,//thu tu uu tieen
        'moniter':monitor, //thông tin màn hình
        'camera_truoc': camera_truoc, //thông tin camera trước
        'camera_sau': camera_sau, //thông tin camera sau
        'ram': ram, //thông tin ram
        'memory':memory, //thông tin bộ nhớ
        'cpu': cpu, //thông tin CPU
        'gpu': gpu, //thông tin GPU
        'pin': pin, //thông tin pin
        'operation':operation,//thông tin hệ diều hành
        'sim': sim,//thông tin sim
        'micro_sd':micro_sd,//thông tin thẻ SD
        'origin':origin,//thông tin nguồn gốc xuất xứ
        'year':year//thông tin năm sản xuất     
    }
    var dataProduct = new ModelProducts(motdoituong);
    dataProduct.save();//hàm lưu dữ liệu
    req.flash('success_msg', 'Thêm sản phẩm thành công!');
    res.redirect('/admin/themsanpham');   
    console.log("dữ liệu product thêm vào:"+dataProduct);
   

 });


  /* get dữ liệu về để Sửa dữ liệu của sản phẩm. */
  router.get('/admin/Edit_Product/:idcansua/:page', function(req, res, next) { //chú ý: lấy từ đường dẫn thì dùng params

    var id2 = req.params.idcansua;
    var a = req.params.page;
    ModelProducts.find({_id : id2},function(err,dataProduct){
      Product_Category.find({},function(err,databrand) {
        
        res.render('./admin/edit_Product',{title:"sửa dữ liệu",data:dataProduct,listBrand:databrand,a:a});   
      })
    
   })
});
  

/*Post Sửa dữ liệu đã sửa lại của sản phẩm. */
router.post('/admin/Edit_Product/:idcansua/:page', function(req, res, next) { //chú ý: lấy từ đường dẫn thì dùng params
  var id =req.params.idcansua;
  var a =req.params.page;
  var  image = req.body.filesProduct +'';
   
  ModelProducts.findById(id,function(err, dataProduct){
    dataProduct.product_name=req.body.product_name;
    dataProduct.description=req.body.description; 
    dataProduct.image= image.split(',').map(s => s.trim()).filter(i => i);
    dataProduct.price= req.body.price;
    dataProduct.promotion_price=req.body.promotion_price;
    dataProduct.quantity=req.body.quantity;
    dataProduct.id_category=req.body.id_category;
    dataProduct.Top=req.body.TopOrNot;
    dataProduct.moniter=req.body.monitor;
    dataProduct.camera_truoc=req.body.camera_truoc;
    dataProduct.camera_sau=req.body.camera_sau;
    dataProduct.ram= req.body.ram;
    dataProduct.memory=req.body.memory;
    dataProduct.cpu= req.body.cpu;
    dataProduct.gpu= req.body.gpu;
    dataProduct.pin= req.body.pin;
    dataProduct.operation=req.body.operation;
    dataProduct.sim=req.body.sim;
    dataProduct.micro_sd=req.body.micro_sd;
    dataProduct.origin=req.body.origin;
    dataProduct.year= req.body. year;
    dataProduct.save();
    req.flash('success_msg', 'Sửa thành công!');
    res.redirect('/admin/danhsachsanpham/'+a);
    res.status(200).send(req.files);
    console.log("data product sau khi sửa:"+dataProduct);
  
    });

});
//trang danh sach don hang
router.get('/admin/donhang', function(req, res){
  Order.find({}, function(err, orders){
    res.render('./admin/order',{orders})
  })
  
})
// get thong tin don hang
router.get('/admin/donhang/:id', function(req, res){
  console.log(req.params.id)
  Order.findOne({_id:req.params.id}, function(err, order){
    console.log(order)
    Feedback.findOne({id_order:req.params.id}, function(err, feedback){
      if(feedback){
        var rating = feedback.rate;
        var feedbacks = feedback.feedbacks;
        res.render('./admin/order_detail', {order, rating, feedbacks})
      }
      else{
        var rating = "";
        var feedbacks = "";
        res.render('./admin/order_detail', {order, rating, feedbacks})
      }
    })
    
  } )
  
})
//click de xac nhan da xu ly don hang
router.get('/admin/completeOrder/:id', function(req, res){
  console.log(req.params.id)
  Order.updateOne({_id:req.params.id}, {completed: 1}, function(err, order){
    console.log(order)
    res.redirect('/admin/donhang/'+req.params.id)
  } )
  
})
//dang xuat admin
router.get('/admin/logout', isLoggedIn, (req, res) =>{
  delete req.session.cart
  req.logout();
  req.flash('success_msg', 'Đăng xuất thành công!');
  res.redirect('/admin/login')  
})
//dang nhap vao trang admin
router.get(('/admin/login'), function(req, res){
  res.render('./admin/login',{msg:""})
})
router.post(('/admin/login'), (req, res, next) =>{
  console.log(req.body)
  passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/admin/login',
    failureFlash: true
  })(req, res, next);
})

/*---------------------------------------------------*/
function isLoggedIn(req, res, next){
  if(!req.user){
    return res.render('./admin/login',{msg:""})
  }
  else{
    if(req.user.Role == "customer"){
      return res.render('./admin/login',{msg:"You are not authorized to access this page"})
    }
    else{
      return next()
    }
  }
}

module.exports = router;




