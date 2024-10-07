const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    productName: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    productImgUrls: [String]
}, { timestamps: true });

const Product = mongoose.model("Product", schema);

module.exports = Product;
