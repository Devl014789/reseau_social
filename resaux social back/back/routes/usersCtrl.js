let bcrypt = require('bcrypt');
let jwtUtiles = require('../../utiles/jwt.Utiles');
let models = require('../.././models');
let asyncLib = require('async');
const { JsonWebTokenError } = require('jsonwebtoken');

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const passwordRegex = /^(?=.*\d).{4,8}$/

module.exports = {
    register: (req, res) => {
        //parameters
        let firstname = req.body.firstname;
        let lastname = req.body.lastname;
        let username = req.body.username;
        let email = req.body.email;
        let password = req.body.password;

        if (firstname == '' || lastname == '' || username == '' || email == '' || password == '') {
            return res.status(400).json({ 'error': 'Champs non remplie' });
        }

        if (username.length >= 13 || username.length <= 4) {
            return res.status(400).json({ 'error': 'Charactere pas assez dans username' });
        }

        if (!emailRegex.test(email)) {
            return res.status(401).json({ 'error': 'email invalide' })
        }

        if (!passwordRegex.test(password)) {
            return res.status(401).json({ 'error': 'Password invalide' })
        }
        //verify 
        models.User.findOne({
            attributes: ['email'],
            where: { email: email }
        })
            .then((userFound) => {
                if (!userFound) {
                    bcrypt.hash(password, 5, (err, bcryptedPassword) => {
                        let newUser = models.User.create({
                            lastname: lastname,
                            firstname: firstname,
                            username: username,
                            email: email,
                            password: bcryptedPassword,
                        })
                            .then((newUser) => {
                                return res.status(201).json({
                                    message: 'User successfully created', 'userid': newUser.id

                                })
                            })
                            .catch((err) => {
                                console.log(err);
                                return res.status(500).json({ 'error': 'cannot add user' });
                            });
                    })
                } else {
                    return res.status(400).json({ 'error': 'user already exist' });
                }
            })
    },
    login: (req, res) => {
        let email = req.body.email;
        let password = req.body.password;
        console.log(email, password);
        if (email == null || password == null) {
            return res.status(400).json({ 'error': 'Champs non remplie' });
        }
        models.User.findOne({
            where: { email: email }
        })
            .then((userFound) => {
                if (userFound) {
                    bcrypt.compare(password, userFound.password, (errBycrypt, resBycrypt) => {
                        if (resBycrypt) {
                            const token = jwtUtiles.generateTokenForUser(userFound)
                            res.cookie('jwt', token, { httpOnly: true});
                            res.status(200).json({
                                'userId': userFound.id,
                                'token': token
                            });
                        } else {
                            return res.status(403).json({ 'error': 'invalide password' })
                        }
                    });
                } else {
                    return res.status(404).json({ 'error': 'user not exist in database' });
                }
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json({ 'error': 'unable to verify user' });
            });

    },
    GetUser: (req, res) => {
        let token = req.cookies.jwt;
        res.cookie('jwt', token, { httpOnly: true });
        let userId = jwtUtiles.getUserId(token)
        models.User.findOne({
            where: { id: userId }
        })
            .then((userFound) => {
                if (userFound) {
                    return res.status(200).json(userFound)
                } else {
                    return res.status(400).json({ 'error': 'user not exist' });
                }
            })
            .catch((err) => {
                return res.status(500).json({ 'error': 'je ne connais l\'erreur' });
            });

    },
    UpdateUser: function (req, res) {
        let token = req.cookies.jwt;
        res.cookie('jwt', token, { httpOnly: true });
        let userId = jwtUtiles.getUserId(token)
        let lastname = req.body.lastname;
        let firstname = req.body.firstname;
        let username = req.body.username;
        asyncLib.waterfall([
            (done) => {
                models.User.findOne({
                    attributes: ['id', 'lastname', 'firstname', 'email'],
                    where: { id: userId }
                }).then((userFound) => {
                    done(null, userFound);
                })
                    .catch((err) => {
                        return res.status(500).json({ 'error': 'unable to verify user' });
                    });
            },
            (userFound, done) => {
                if (userFound) {
                    userFound.update({
                        lastname: (lastname ? lastname : userFound.lastname),
                        firstname: (firstname ? firstname : userFound.firstname),
                        username: (username? username : userFound.username),
                    }).then(() => {
                        done(userFound);
                    }).catch((err) => {
                        res.status(500).json({ 'error': 'cannot update user' });
                    });
                } else {
                    res.status(404).json({ 'error': 'user not found' });
                }
            },
        ], (userFound) => {
            if (userFound) {
                return res.status(201).json(userFound);
            } else {
                return res.status(500).json({ 'error': 'cannot update user profile' });
            }
        });
    },
    DeleteUser: (req, res) => {
        let token = req.cookies.jwt;
        res.cookie('jwt', token, { httpOnly: true });
        let userId = jwtUtiles.getUserId(token)
        models.User.findOne({
            where: { id: userId }
        })
            .then((userFound) => {
                if (userFound) {
                    models.User.destroy({
                        where: { id: userId }
                    })
                        .then((deleteUser) => {
                            return res.status(201).json({
                                message: 'User successffuly deleted'
                            })
                        })
                        .catch((err) => {
                            return res.status(500).json({ 'error': 'cannot delete user' });
                        });
                } else {
                    return res.status(400).json({ 'error': 'user not exist' });
                }
            })
    },
    Logout: (req, res) => {
        res.cookie('jwt', '', {maxAge:1});
        res.redirect('/');
        return res.status(201).json({
            message: 'successfuly logout'
        })
    }

}