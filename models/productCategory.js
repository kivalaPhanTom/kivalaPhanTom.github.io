const mongoose = require('mongoose');
mongoose.set("useNewUrlParser", true);
const categorySchema = new mongoose.Schema({
    category_name: {
        type: String
    },
    description: {
        type: String,
    },
    image: {
        type: Array,
    },
    createDate: {
        type: Date,
        default: Date.now
    }

}, {collection: "Product_Category"});
module.exports = mongoose.model('Product_Category', categorySchema);