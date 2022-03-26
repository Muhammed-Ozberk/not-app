const { body } = require('express-validator');

const validateNewPassword = () => {
    return [
        body('password').trim()
            .isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalı')
            .isLength({ max: 20 }).withMessage('Şifre en fazla 20 karakter olmalı'),

        body('repassword').trim().custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Şifreler aynı değil');
            }
            return true;
        })
    ];
}

const validateLogin = () => {

    return [
        body('email')
            .trim()
            .isEmail().withMessage('Geçerli bir mail giriniz'),

        body('password').trim()
            .isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalı')
            .isLength({ max: 20 }).withMessage('Şifre en fazla 20 karakter olmalı'),
    ];
}

const validateEmail = () => {
    return [
        body('email')
            .trim()
            .isEmail().withMessage('Geçerli bir mail giriniz'),
    ];
}

module.exports = {
    validateLogin,
    validateEmail,
    validateNewPassword
}