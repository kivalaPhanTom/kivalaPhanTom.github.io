var mongoose = require('mongoose');
mongoose.set("useNewUrlParser", true);
var FeedbackSchema = new mongoose.Schema({
    id_order: {
        type: String
    },
    rate: {
        type: String
    },
    feedbacks: {
        type: String
    },
    create_day: {
        type: String
    }
  
},{collection:'Feedbacks'}); /* News chính là collection mà ta đã tạo ở CSDL mongo*/

module.exports=mongoose.model("Feedbacks",FeedbackSchema);