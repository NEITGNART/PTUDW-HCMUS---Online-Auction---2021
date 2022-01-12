import mongoose from 'mongoose'

const WinningBidSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    productId: {
        type: String
    }
}, {
    timestamps: true,

})

export default mongoose.model('winningBid', WinningBidSchema, 'winningBid');