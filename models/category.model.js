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

const categoryModel = mongoose.model('category', CategorySchema, 'categories');
export default categoryModel;