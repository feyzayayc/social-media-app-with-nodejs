const express = require('express');
const dotenv = require('dotenv').config();
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const session = require('express-session');

const flash = require('connect-flash');

// Db bağlantısı
require('./src/config/database');
const userRouter = require('./src/router/auth_router');
const adminRouter = require('./src/router/admin_router');

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(flash());

app.use(session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use((req, res, next) => {
    res.locals.validation_error = req.flash('validation_error');
    res.locals.success_validation = req.flash('success_validation');
    res.locals.login_error = req.flash('login_error');
    next();
});

const expressLayout = require('express-ejs-layouts');
const path = require('path');
app.use(expressLayout);
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, './src/views'));

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome To Social Media App'
    })
});

app.use('/', userRouter);
app.use('/admin', adminRouter);


app.listen(process.env.PORT, () => {
    console.log(`Listening On Port ${process.env.PORT}`, `http://localhost:${process.env.PORT}`);
});
