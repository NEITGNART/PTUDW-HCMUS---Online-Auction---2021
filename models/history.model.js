import mongoose from 'mongoose';

const historyBidSchema = new mongoose.Schema({
    turn: {
        type: [{
            bidDate: String,
            username: String,
            price: Number
        }]
    }
});

export default mongoose.model('history', historyBidSchema, 'histories');