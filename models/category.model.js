import mongoose from 'mongoose'

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    amount: {
        type: Number
    },
    subCat: {
        type: [String]
    },
    amountSubCat: {
        type: [Number]
    }
})

CategorySchema.index({
    name: 'text',
    subCat: 'text'
});

export default mongoose.model('category', CategorySchema, 'categories');