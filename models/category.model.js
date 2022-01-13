import mongoose from 'mongoose'

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    amount: {
        type: Number,
        default: 0
    },
    subCat: {
        type: [String],
        default: []
    },
    amountSubCat: {
        type: [Number],
        default: []
    }
})

CategorySchema.index({
    name: 'text',
    subCat: 'text'
});

export default mongoose.model('category', CategorySchema, 'categories');