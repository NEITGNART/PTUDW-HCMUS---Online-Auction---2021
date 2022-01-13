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
        type: Date,
        default: Date.now()
    },
    expDate: {
        type: Date,
        default: Date.now() + 10 * 24 * 60 * 60 * 1000
    },
    images: {
        type: Array
    },
    description: {
        type: String,
        default: ''
    },
    currentPrice: {
        type: Number,
        default: 100000
    },
    stepPrice: {
        type: Number,
        default: 100000
    },

    bestPrice: { // mua luon
        type: Number
    },

    autoExtend: { // tang gia theo thoi gian
        type: Boolean,
        default: false
    },

    topBidder: {
        type: String,
        default: ''
    },

    status: {
        type: String,
        enum: ['bidding', 'sold', 'expired'],
        default: 'bidding'
    },

    historyBidId: {
        type: [{
            bidDate: Date,
            // username is ID not name
            username: String,
            // max price of bidder
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
    category: 'text'
});

export default mongoose.model('product', ProductSchema, 'products');