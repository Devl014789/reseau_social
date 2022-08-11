let asyncLib = require('async');
let jwtUtiles = require('../../utiles/jwt.Utiles');
let models = require('../.././models');
const publication = require('../.././models');


module.exports = {
    createPost: (req, res) => {


        let token = req.cookies.jwt;
        res.cookie('jwt', token, { httpOnly: true });
        let userId = jwtUtiles.getUserId(token)
        let text = req.body.text;

        if (text == '') {
            return res.status(400).json({ 'error': 'missing parameters' });
        }

        asyncLib.waterfall([
            (done) => {
                if (done) {
                    models.Publication.create({
                        text: text,
                        likes: 0,
                        //image: image,
                        UserId: userId

                    })
                        .then((newPost) => {
                            done(newPost)
                        })
                } else {
                    return res.status(404).json({ 'error': 'user not found' })
                }
            },
        ],
            (newPost) => {
                if (newPost) {
                    return res.status(201).json(newPost)
                } else {
                    return res.status(500).json({ 'error': 'cannot post the publication' })
                }
            }
        )

    },
    listPost: (req, res) => {
        models.Publication.findAll({
            attributes: ["id", "userId", "text", "likes"]
        })
            .then((post) => {
                if (post) {
                    return res.status(200).json(post)
                } else {
                    return res.status(404).json({ 'error': 'no post found' })
                }
            })
            .catch(function (err) {
                console.log(err);
                res.status(500).json({ "error": "invalid fields" });
            })
    },
    deletePost: (req, res) => {
        let publicationId = req.params.id
        let token = req.cookies.jwt;
        res.cookie('jwt', token, { httpOnly: true });
        let userId = jwtUtiles.getUserId(token)


        models.Publication.destroy({
            where: { 
                id: publicationId,
                userId: userId,
            }
        })
            .then((deletePublication) => {
                return res.status(201).json({
                    message: 'Post successffuly deleted'
                })
            })
            .catch((err) => {
                return res.status(500).json({ 'error': 'cannot delete this post' })
            })
    
},
}
