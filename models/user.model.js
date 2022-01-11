import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
    type: {
        type: String,
        lowercase: true,
        trim: true,
        enum: ['bidder', 'seller', 'admin'],
        default: 'bidder'
    },

    status: {
        type: String,
        enum: ['Pending', 'Active'],
        default: 'Pending'
    },

    confirmationCode: {
        type: String,
        unique: true
    },


    method: {
        type: String,
        enum: ['local', 'facebook', 'google', 'github'],
        trim: true,
        lowercase: true,
        default: 'local'
    },

    authId: String,
    secret: String,

    // isVerified: {
    //     type: Boolean,
    //     default: false
    // },

    profile: {
        name: {
            type: String,
            trim: true,
            required: true
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            required: true
        },
        birthday: {
            type: Date,
            default: Date.now()
        },
        address: {
            type: String,
            trim: true
        },
        phoneNumber: {
            type: String
        },
        avatar: {
            type: String
        }
    },

    wishlist: {
        type: [String]
    },

    isRequest: {
        type: Boolean,
        default: false
    },
    point: {
        type: Number,
        default: 100
    },
    reviews: {
        author: {
            String
        },
        date: {
            Date
        },
        message: {
            String
        },
        point: {
            Number
        }
    },
    currentBiddingList: {
        type: [{
            idProduct: String,
            maxPrice: Number
        }],
        default: []
    }

})

export default mongoose.model('user', UserSchema, 'users');