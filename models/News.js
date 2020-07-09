var mongoose = require('mongoose');
const moment = require('moment-timezone'); // sử dụng thư viện moment-timezone
const dateThailand = moment.tz(Date.now(),"Asia/Bangkok"); // sử dụng timezone của thái lan, vì thái lan vad việt nam cùng timezone

var tintuc = new mongoose.Schema({
    image_News:{type:Array},
    title_news_intro: 'string',
    content_News_intro:'string',
    time_news_intro:{ type: Date,default:dateThailand },
  
},{collection:'News'}); /* News chính là collection mà ta đã tạo ở CSDL mongo*/

module.exports=mongoose.model("News",tintuc);