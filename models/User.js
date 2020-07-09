const mongoose = require('mongoose');
mongoose.set("useNewUrlParser", true);
// mongoose.connect('mongodb://localhost:27017/web')
// var db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error!"));
// db.once("open", function(){
//     console.log("Ket nois DB thanh cong!!")
// })
const UserSchema = new mongoose.Schema({
    Social_id: {
        type : String
    },
    Email: {
        type: String,
        required: true
    },
    Address: {
        type: String
    },
    Name: {
        type: String,
        required: true
    },
    Phone:{
        type: String
    },
    Password: {
        type: String
    },
    CreateDate: {
        type: Date,
        default: Date.now()
    }

}, {collection: "User"});
module.exports = mongoose.model('User', UserSchema);