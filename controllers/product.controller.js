import Product from '../models/product.model.js';
import moment from 'moment'

export default {
    listProduct(req, res) {
        res.render('product');
    },

    maskInfo(value) {
        let maskedValue = value;
        if (value && value.length > 5) {
            maskedValue =
                "***" + maskedValue.substring(value.length - 4, value.length);
        } else {
            maskedValue = "****";
        }
        return maskedValue;
    },

    isExpired(date) {
        return moment(date).diff(moment());
    },

    extendExpire(date) {
        return moment(date).add(10, 'minutes');
    },

    // listProduct(req, res) {

    // }

};