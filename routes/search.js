var express = require('express');
var router = express.Router();
var fs = require('fs')
var multer1 = require('multer');//sử dụng thư viện time zone để up ảnh
var moment = require('moment-timezone');
var faker = require('faker')
var ModelProducts =require('../models/Product');
var Product_Category = require('../models/productCategory');
var ModelNews =require('../models/News');


function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.get("/search", function(req, res) {
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
    var notFind=null;
    if (req.query.search) { //nếu như có request từ thanh search
       const regex = new RegExp(escapeRegex(req.query.search), 'gi');
       ModelProducts.find({ "product_name":regex }, function(err, dataProduct) {
        ModelNews.find({"title_news_intro":regex }, function(err, dataNews) {
        Product_Category.find({},function(err,dataBrand){ 
            if(err) {
                console.log(err);
            } else {
                if( dataProduct.length < 1 &&  dataNews.length <1 )
                {
                    notFind="Không tìm thấy kết quả !!!"
                }
                res.render("search", { dataNews:dataNews,dataProduct:dataProduct,dataBrand:dataBrand, regex:req.query.search,notFind:notFind,list_Alldata_search:list_Alldata_search});
            }
        });
            });
       }); 
    } else{  //Nếu ko có lượt request nào trên ô search mà bấm vào nút tìm kiếm
        ModelProducts.find({}, function(err, dataProduct) {
            ModelNews.find({}, function(err, dataNews) {
            //thì cho hết toàn bộ ra
            Product_Category.find({},function(err,dataBrand){ 
                if(err) {
                    console.log(err);
                } else {
                 
                    if( dataProduct.length<1)
                    {
                        notFind="Không tìm thấy kết quả !!!"
                    }
                    res.render("search", { dataNews:dataNews, dataProduct:dataProduct,dataBrand:dataBrand, regex:req.query.search,notFind:notFind,list_Alldata_search:list_Alldata_search});
                }
            });
                });
           }); 
    }

})


module.exports = router;