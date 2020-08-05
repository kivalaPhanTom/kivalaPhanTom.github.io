var mongoose = require('mongoose');
const moment = require('moment-timezone'); // sử dụng thư viện moment-timezone
const dateThailand = moment.tz(Date.now(),"Asia/Bangkok"); // sử dụng timezone của thái lan, vì thái lan và việt nam cùng timezone

var Comments = new mongoose.Schema({
    comment : String,    
    postId : String,
    userId:String,
    nameUser:String,
    time_comment:{ type: Date,default:dateThailand }
  
},{collection:'Comments'}); /*Comments chính là collection mà ta đã tạo ở CSDL mongo*/
module.exports = mongoose.model('Comments', Comments);/*Comments  chính là collection mà ta đã tạo ở CSDL mongo*/