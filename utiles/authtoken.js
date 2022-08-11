let jwt = require('jsonwebtoken');
let jwtUtiles = require('./jwt.Utiles')
let modelsUser = require('../models/user');
let cookieParser = require('cookie-parser')

module.exports.checkUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        jwt.verify(token, jwtUtiles.JWT_SIGN_SECRET, async (err, decodedToken) => {
            if (err) {
                res.locals.User = null;
                res.cookie('jwt','', {maxAge: 1})
                next();
            } else {
                let User = await modelsUser.findById(decodedToken.id);
                res.locals.User = User;
                res.cookies('jwt', token, { httpOnly: true});
                console.log(User);
                next();
            }
        })
    } else {
        res.locals.User = null;
        next();
    }
}