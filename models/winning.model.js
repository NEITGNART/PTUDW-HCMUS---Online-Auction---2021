import mongoose from 'mongoose'

const WinningBidSchema = new mongoose.Schema({
    userId: {
        String
    },
    productId: {
        String
    }
}, {
    timestamps: true,

})

export default mongoose.model('winningBid', WinningBidSchema, 'winningBid');