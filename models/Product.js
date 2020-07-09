var mongoose = require('mongoose');
const moment = require('moment-timezone'); // sử dụng thư viện moment-timezone
const dateThailand = moment.tz(Date.now(),"Asia/Bangkok"); // sử dụng timezone của thái lan, vì thái lan vad việt nam cùng timezone

var  product = new mongoose.Schema({
   
    product_name: 'string',//tên sản phẩm
    description:'string', //mục mô tả, dự phòng khi web mình cần mô tả gì đó thêm
    image:{type:Array},//mảng ảnh sản phẩm
    price: {type: String},//giá 
    promotion_price: {type: String}, //giá khuyến mãi
    quantity:{type:Number},//số lượng
    id_category: {type: String},//sản phẩm này thuộc loại nào
    createDate: {type: Date,default:dateThailand },// thời gian tạo
    moniter:{ type: String, required: true}, //thông tin màn hình
    camera_truoc: {type: String,required: true}, //thông tin camera trước
    camera_sau: {type: String}, //thông tin camera sau
    ram: { type: String}, //thông tin ram
    memory: {type: String }, //thông tin bộ nhớ
    cpu: {type: String}, //thông tin CPU
    gpu: {type: String}, //thông tin GPU
    pin: {type: String}, //thông tin pin
    operation: {type: String},//thông tin hệ diều hành
    sim: {type: String},//thông tin sim
    micro_sd: {type: String},//thông tin thẻ SD
    origin: {type: String},//thông tin nguồn gốc xuất xứ
    year: {type: String},//thông tin năm sản xuất
    Top:{type:String} //sản phẩm có thuộc TOP hay không
},{collection:"Product"}); /* "Product" chính là collection mà ta đã tạo ở CSDL mongo*/

module.exports=mongoose.model("Product", product);

//20 trường (ko tính trường createDate)

