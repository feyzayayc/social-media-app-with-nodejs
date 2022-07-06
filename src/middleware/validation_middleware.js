const { body } = require('express-validator');

const validateNewUser = () => {
    return [
        body('email')
            .trim()
            .isEmail().withMessage('Geçerli bir mail adresi giriniz'),

        body('password')
            .trim()
            .isLength({ min: 6 }).withMessage('Şifre en az 6 karakterli olmalıdır')
            .isLength({ max: 16 }).withMessage('Şifre en fazla 16 karakterli olmalıdır'),

        body('name')
            .trim()
            .isLength({ min: 4 }).withMessage('İsim en az 4 karakterli olmalıdır')
            .isLength({ max: 14 }).withMessage('İsim en fazla 15 karakterli olmalıdır'),

        body('username')
            .trim()
            .isLength({ min: 3 }).withMessage('Kullanıcı adı en az 3 karakterli olmalıdır')
            .isLength({ max: 13 }).withMessage('Kullanıcı adı en fazla 13 karakterli olmalıdır'),

        body('repassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Şifreler aynı değil!');
            }

            // Indicates the success of this synchronous custom validator
            return true;
        }),
    ]
}

const validateLogin = () => {
    return [
        body('username')
            .trim()
            .isLength({ min: 3 }).withMessage('Kullanıcı adı en az 3 karakterli olmalıdır')
            .isLength({ max: 13 }).withMessage('Kullanıcı adı en fazla 13 karakterli olmalıdır'),

        body('password')
            .trim()
            .isLength({ min: 6 }).withMessage('Şifre en az 6 karakterli olmalıdır')
            .isLength({ max: 16 }).withMessage('Şifre en fazla 16 karakterli olmalıdır'),
    ]
}

module.exports = {
    validateNewUser,
    validateLogin
};