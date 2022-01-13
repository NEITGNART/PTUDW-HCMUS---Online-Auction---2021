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
            type: String,
            default: 'https://media.istockphoto.com/vectors/default-profile-picture-avatar-photo-placeholder-vector-illustration-vector-id1223671392?k=20&m=1223671392&s=612x612&w=0&h=lGpj2vWAI3WUT1JeJWm1PRoHT3V15_1pdcTn2szdwQ0='
        }
    },

    wishlist: {
        type: [String]
    },
    request: {
        isAccepted: {
            type: Boolean,
            default: false
        },
        isRequest: {
            type: Boolean,
            default: false
        },
        expTime: {
            type: Date,
            default: Date.now()
            // default: Date.now() + 7 * 24 * 60 * 60 * 1000
        }
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
    },
    winBiddingList: {
        type: [{
            idProduct: String
        }],
        default: []
    }

})

export default mongoose.model('user', UserSchema, 'users');