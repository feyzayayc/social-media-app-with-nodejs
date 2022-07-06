const { body } = require('express-validator');

const validateNewUser = () => {
    return [
        body('email')
            .trim()
            .isEmail().withMessage('Please enter a valid e-mail address.'),

        body('password')
            .trim()
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.')
            .isLength({ max: 16 }).withMessage('Password must be a maximum of 16 characters.'),

        body('name')
            .trim()
            .isLength({ min: 4 }).withMessage('Name must be at least 4 characters.')
            .isLength({ max: 20 }).withMessage('Name must be no more than 20 characters.'),

        body('username')
            .trim()
            .isLength({ min: 4 }).withMessage('Username must be at least 4 characters.')
            .isLength({ max: 16 }).withMessage('Username must be a maximum of 16 characters.'),

        body('repassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords are not the same!');
            }
            return true;
        }),
    ]
}

const validateLogin = () => {
    return [
        body('username')
            .trim()
            .isLength({ min: 4 }).withMessage('Username must be at least 4 characters.')
            .isLength({ max: 16 }).withMessage('Username must be a maximum of 16 characters.'),

        body('password')
            .trim()
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.')
            .isLength({ max: 16 }).withMessage('Password must be a maximum of 16 characters.'),

    ]
}

const validateUpdateUser = () => {
    return [
       body('newPassword')
            .trim()
            .isLength({ min: 6 }).withMessage('Password must be at least 6 characters.')
            .isLength({ max: 16 }).withMessage('Password must be a maximum of 16 characters.'),

            body('newPasswordAgain')
            .trim()
            .isLength({ min: 6 }).withMessage('Password (Again) must be at least 6 characters.')
            .isLength({ max: 16 }).withMessage('Password (Again) must be a maximum of 16 characters.'),
    ]
}

module.exports = {
    validateNewUser,
    validateLogin,
    validateUpdateUser
};