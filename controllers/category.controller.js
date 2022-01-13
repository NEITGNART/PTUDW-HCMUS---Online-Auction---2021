import Category from '../models/category.model.js';
import ProductModel from "../models/product.model.js";
import UserModel from "../models/user.model.js";


const categoryController = {
    getAll: async (req, res) => {
        try {
            const categories = await Category.find();
            res.status(200).json(categories);
        } catch (error) {
            res.status(500).json({
                message: error.message
            });
        }
    },
    getById: async (req, res) => {
        const id = req.query.id;
        const category = await Category.findById(id);
        if (!category) {
            res.status(404).send({});
        } else {
            res.status(200).send({});
        }
    },
    create: async (req, res) => {
        const category = new Category({
            name: req.body.name,
        });
        await category.save();
        res.status(200).send({
            category
        });
    },

    deleteCategory: async (req, res) => {
        const id = req.query.id;
        const category = await Category.findById(id);

        if (!category) {
            res.status(404).send({
                message: 'Category not found with id ' + id
            });
        } else {
            // check that amount of products in category is 0

            if (category.amount === 0) {
                await category.remove();
                res.status(200).send({
                    message: 'Category deleted successfully!'

                });
            } else {
                res.status(400).send({
                    message: 'Category has products'
                });
            }
        }
    },
    update : async (req, res) => {
        const id = req.query.id;
        const category = await Category.findById(id);
        if (!category) {
            res.status(404).send({
                message: 'Category not found with id ' + id
            });
        } else {
            category.name = req.body.name;
            await category.save();
            res.status(200).send({
                message: 'Category updated successfully!'
            });
        }
    },

}

export default categoryController;