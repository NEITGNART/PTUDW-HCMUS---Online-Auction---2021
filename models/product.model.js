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
    expDate: {
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

    topBidder: {
        type: String
    },

    status: {
        type: String,
        default: 'bidding'
    },

    historyBidId: {
        type: [{
            bidDate: Date,
            username: String,
            price: Number
        }],
        default: []
    },

    block: {
        type: [String],
        default: []
    }
})

ProductSchema.index({
    name: 'text',
    description: 'text'
});

export default mongoose.model('product', ProductSchema, 'products');