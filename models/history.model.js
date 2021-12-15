import mongoose from 'mongoose';

const  historyBidSchema = new mongoose.Schema({
    turn: {
        type: [{
            bidDate: String,
            username: String,
            price: Number
        }]
    }
});

const historyBidModel = mongoose.model('history', historyBidSchema, 'histories');
export default historyBidModel;