var mongoose = require('mongoose');
const moment = require('moment-timezone'); // sử dụng thư viện moment-timezone
const dateThailand = moment.tz(Date.now(),"Asia/Bangkok"); // sử dụng timezone của thái lan, vì thái lan và việt nam cùng timezone

var Comments_reply = new mongoose.Schema({
    comment_reply : String,   
    comment_parent_id: String, 
    postId : String,
    userId_reply:String,
    nameUser_reply:String,
    time_comment_reply:{ type: Date,default:dateThailand }
  
},{collection:'Comments_reply'}); /*'Comments_reply chính là collection mà ta đã tạo ở CSDL mongo*/
module.exports = mongoose.model('Comments_reply', Comments_reply);