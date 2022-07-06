const jwt = require('jsonwebtoken');

const isLoggedIn = function (req, res, next) {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, (err, decodeToken) => {
            if (err) {
                console.log(err);
                res.redirect('/login');
            }
            else {
                req.user_id = decodeToken.userId;
                next();
            }
        })
    }
    else {
        res.redirect('/login');
    }
}
module.exports = {
    isLoggedIn
}