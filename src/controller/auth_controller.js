const { validationResult } = require('express-validator');
const User = require('../model/user_model');
const authMiddleware = require('../middleware/auth_middleware');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");
const flash = require('connect-flash');


const maxAge = 60 * 60 * 24;
const tokenCreate = (id, userId) => {
    return jwt.sign({ id, userId }, process.env.SECRET_KEY, { expiresIn: maxAge });
}

// Register Sayfası Get
const showRegister = (req, res, next) => {
    res.render('register', { layout: './layout/auth_layouts.ejs' })
}
// Register Sayfası Post
const register = async (req, res, next) => {
    const errorsArray = validationResult(req);
    if (!errorsArray.isEmpty()) {

        req.flash('validation_error', errorsArray.array());
        res.redirect('/register')
    } else {
        const _user = await User.findOne({ email: req.body.email });
        if (_user) {
            res.render('register', { layout: './layout/auth_layouts.ejs', validation_error: [{ msg: 'This e-mail is registered' }] });
        }
        else {
            const hashPassword = await bcrypt.hash(req.body.password, 10);
            const newUser = new User({
                email: req.body.email,
                username: req.body.username,
                name: req.body.name,
                password: hashPassword
            });
            await newUser.save();
            res.render('login', { layout: './layout/auth_layouts.ejs', success_validation: [{ msg: 'Registration successful, you can login' }] })
        }
    }


}

// Login Sayfası Get
const showLogin = (req, res, next) => {
    res.render('login', { layout: './layout/auth_layouts.ejs' })
}
// Login Sayfası Post
const login = async (req, res, next) => {
    try {
        const _user = await User.findOne({ username: req.body.username });
        if (!_user) {
            req.flash('validation_error', [{ msg: 'User not found' }]);
            res.redirect('login');
        }
        const hashPassword = await bcrypt.compare(req.body.password, _user.password);
        if (!hashPassword) {
            req.flash('validation_error', [{ msg: 'Password is incorrect' }]);
            res.redirect('login');
        }
        req.flash('success_validation', [{ msg: 'Login successful' }]);
        const token = tokenCreate(req.body._id, _user.id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.redirect('/admin/timeline');
    } catch (error) {
        console.log(error);
    }

}


// Forget Password Sayfası Get
const showForgetPassword = (req, res, next) => {
    res.render('forget_password', { layout: './layout/auth_layouts.ejs' })
}
// Forget Password Sayfası Post
const forgetPassword = (req, res, next) => {
    res.render('forget_password', { layout: './layout/auth_layouts.ejs' })
}
const logOut = (req, res, next) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.cookie('userId', '', { maxAge: 1 });
    res.redirect('login');
}

const isLoggedIn = function (req, res, next) {
    const token = req.body.jwt;
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, (err, decodeToken) => {
            if (err) {
                console.log(err);
                res.redirect('/login');
            }
            else {
                next();
            }
        })
    }
    else {
        res.redirect('/login');
    }
}

module.exports = {
    showRegister,
    register,
    showLogin,
    login,
    showForgetPassword,
    forgetPassword,
    logOut,
    isLoggedIn
}