import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    name: {
        type: String
    },
    category: {
        type: Array
    },
    seller: {
        type: String
    },
    sellDate: {
        type: Date
    },
    expDate:{
        type: Date
    },
    images: {
        type: Array
    },
    description: {
        type: String
    },
    currentPrice: {
        type: Number,
        default: 10000
    },
    stepPrice: {
        type: Number
    },

    bestPrice: { // mua luon
        type: Number
    },

    topBidder:{
        type: String
    },

    status: {
        type: String,
        default: 'bidding'
    },

    historyBidId:{
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'history'
    },

    block:{
        type: [String],
        default: []
    }
})


const productModel = mongoose.model('product', ProductSchema, 'products');
export default productModel;

