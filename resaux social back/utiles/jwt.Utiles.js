let jwt = require('jsonwebtoken');
const JWT_SIGN_SECRET = 'ikbizfhfihfiuhqzibin4949494ihnzkfn4694694646ibqihojgoqhzppzojOOQJOJQOIGRJOGJ646464646OJQEGGLHLQGOQHodhosghollvlkgqklhgroh646464464lgahzojfhqv464664646464oi'
module.exports = {
    generateTokenForUser: (userData) => {
        return jwt.sign({
            userId: userData.id
        },
            JWT_SIGN_SECRET, {
            expiresIn: '1y'
        })
    },
    parseAuthorization: (authorization) => {
        return (authorization != null) ? authorization.replace('Bearer ', '') : null;
    },
    getUserId: (token) => {
        let userId = -1;

        if (token != null) {
            try {
                let jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
                if (jwtToken != null) {
                    userId = jwtToken.userId;
                }
            }
            catch (err) {
                console.log(err);
            }
        }
        return userId;
    },
}