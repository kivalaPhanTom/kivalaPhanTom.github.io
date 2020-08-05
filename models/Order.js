var mongoose = require('mongoose');
mongoose.set("useNewUrlParser", true);
var OrderSchema = new mongoose.Schema({
    id_customer: {
        type: Object
    },
    name_customer: {
        type: String
    },
    address: {
        type: String
    },
    phone: {
        type: String
    },
    email:{
        type: String
    },
    note: {
        type: String
    },
    totalPrice:{
        type: String
    },
    items: {
        type: Object
    },
    completed: {
        type: Number
    },
    completed_feedback: {
        type: Number
    },
    create_day: {
        type: String
    }
  
},{collection:'Order'}); /* News chính là collection mà ta đã tạo ở CSDL mongo*/

module.exports=mongoose.model("Order",OrderSchema);