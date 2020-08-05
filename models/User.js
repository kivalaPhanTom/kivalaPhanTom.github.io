const mongoose = require('mongoose');
mongoose.set("useNewUrlParser", true);


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
    Role:{
        type:String
    },
    Code: {
        type: String
    },
    CreateDate: {
        type: Date,
        default: Date.now()
    }

}, {collection: "User"});
module.exports = mongoose.model('User', UserSchema);