import {
    check
} from "express-validator";

export default {
    signUp: [
        check('username')
        .not()
        .isEmpty()
        .withMessage('Yêu cầu nhập đủ thông tin')
        .isLength({
            min: 5,
            max: 20
        })
        .withMessage('Chiều dài tên người dùng 5-20 ký tự'),

        check('email')
        .not()
        .isEmpty()
        .withMessage('Yêu cầu nhập đủ thông tin')
        .isEmail()
        .normalizeEmail()
        .withMessage('Email không thích hợp'),

        check('password')
        .not()
        .isEmpty()
        .withMessage('Yêu cầu nhập đủ thông tin')
        .isLength({
            min: 6
        }).withMessage('Chiều dài tối thiểu là 6 ký tự')
        .matches(/\d/)
        .withMessage('Phải chứa ít nhất 1 chữ số'),

        check('name')
        .not()
        .isEmpty()
        .withMessage('Yêu cầu nhập đủ thông tin'),

        check('address')
        .not()
        .isEmpty()
        .withMessage('Yêu cầu nhập đủ thông tin')
    ]
}