import ProductModel from "../models/product.model.js";
import UserModel from "../models/user.model.js";
import moment from "moment";


const adminController = {

    deleteProduct: async (req, res) => {
        const id = req.query.id;
        const product = await ProductModel.findByIdAndDelete(id);
        if (!product) {
            res.status(404).send({
                message: 'Product not found with id ' + id
            });k
        } else {
            res.status(200).send({
                message: 'Product deleted successfully!'
            });
        }
    },

    viewPendingList: async (req, res) => {
        // find all user that have request that contain object
        const pendingList = await UserModel.find({
            'request.isAccepted': false,
            'request.isRequest': true
        });

        if (!pendingList) {
            res.status(404).send({
                message: 'No pending list'
            });
        } else {
            res.status(200).send({
                pendingList
            });
        }
    },

    approveBidder: async (req, res) => {
        const id = req.query.id;
        const user = await UserModel.findById(id);
        if (!user) {
            res.status(404).send({
                message: 'User not found with id ' + id
            });
        } else {
            user.method = 'seller'
            user.request.isAccepted = true;
            user.request.isRequest = false;
            user.request.expDate = Date.now() + (1000 * 60 * 60 * 24 * 7);
            await user.save();
            res.status(200).send({
                message: 'Bidder approved successfully!'
            });
        }
    },

    degrade: async (req, res) => {
        const id = req.query.id;
        const user = await UserModel.findById(id);
        if (!user) {
            res.status(404).send({
                message: 'User not found with id ' + id
            });
        } else {
            user.request.isAccepted = false;
            user.request.isRequest = false;
            user.method = 'bidder'
            await user.save();
            res.status(200).send({
                message: 'Bidder declined successfully!'
            });
        }
    },
    viewListUser: async (req, res) => {
        const listUser = await UserModel.find({});
        if (!listUser) {
            res.status(404).send({
                message: 'No list user'
            });
        } else {
            res.status(200).send({
                listUser
            });
        }
    },
    findUser: async (req, res) => {
        const id = req.query.id;
        const user = await UserModel.findById(id).lean();

        const currentBiddingList = [];
        const winBiddingList = [];
        const wishList = [];

        for (let i = 0; i < user.currentBiddingList.length; ++i) {
            const product = await ProductModel.findById(user.currentBiddingList[i].idProduct).lean();
            product.expDate = moment(product.expDate).format('DD/MM/YYYY');
            // join with users using product.seller
            product.seller = await UserModel.findById(product.seller).lean();
            currentBiddingList.push(product);
        }


        for (let i = 0; i < user.winBiddingList.length; ++i) {
            const product = await ProductModel.findById(user.winBiddingList[i]).lean();
            product.expDate = moment(product.expDate).format('DD/MM/YYYY');
            // join with users using product.seller
            product.seller = await UserModel.findById(product.seller).lean();
            winBiddingList.push(product);
        }

        // find all product that have seller is id of user._id
        const ownerProduct = await ProductModel.find({
            seller: id
        }).lean();

        for (let i = 0; i < ownerProduct.length; ++i) {
            ownerProduct[i].expDate = moment(ownerProduct[i].expDate).format('DD/MM/YYYY');
        }

        // find withList



        for (let i = 0; i < user.wishlist.length; ++i) {
            const product = await ProductModel.findById(user.wishlist[i]).lean();
            product.expDate = moment(product.expDate).format('DD/MM/YYYY');
            // join with users using product.seller
            product.seller = await UserModel.findById(product.seller).lean();
            wishList.push(product);
        }






        var reviewsList = user.reviews;
        for (let i = 0; i < reviewsList.length; i++) {
            reviewsList[i].isLike = (reviewsList[i].point > 0);
            var temp = await UserModel.findById(reviewsList[i].author).lean();
            reviewsList[i].date = moment(reviewsList[i].date).format('HH:MM DD/MM/YYYY');
            reviewsList[i].authorName = temp.profile.name;
            reviewsList[i].userAvatar = temp.profile.avatar;
        }

        if (!user) {
            res.render('404', {
                layout: null
            });
        } else {
            res.render('detail-user', {
                user,
                currentBiddingList,
                winBiddingList,
                listProduct: ownerProduct,
                wishList,
                reviewsList: reviewsList,
                isHaveFeedBack: reviewsList.length > 0,
                layout: null
            });
        }
    },

    findProduct: async (req, res) => {
        const id = req.query.id;
        const product = await ProductModel.findById(id);
        if (!product) {
            res.status(404).send({
                message: 'Product not found with id ' + id
            });
        } else {
            res.status(200).send({
                product
            });
        }
    },

    viewListProduct: async (req, res) => {
        const listProduct = await ProductModel.find({});
        if (!listProduct) {
            res.status(404).send({
                message: 'No list product'
            });
        } else {
            res.status(200).send({
                listProduct
            });
        }
    },



}

export default adminController;



