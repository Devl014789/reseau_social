let asyncLib = require('async');
let jwtUtiles = require('../../utiles/jwt.Utiles');
let models = require('../.././models');
const publication = require('../.././models');


module.exports = {
    createComment: (req, res) => {


        let token = req.cookies.jwt;
        res.cookie('jwt', token, { httpOnly: true });
        let userId = jwtUtiles.getUserId(token);
        let content = req.body.content;
        let PublicationId = req.params.id

        if (content == '') {
            return res.status(400).json({ 'error': 'Champ commentaires non remplie' });
        }
        models.Comment.create({
            content: content,
            userId: userId,
            publicationId: PublicationId,
        })
            .then((newComment) => {
                return res.status(201).json(newComment), newComment.id
            })
            .catch((err) => {
                return res.status(400).json({ error: "cannot comment" })
            }

            )

    },
    listComment: (req, res) => {
            models.Comment.findAll({
                attributes: ["id", "userId", 'PublicationId', "content"]
            })
                .then((comment) => {
                    if (comment) {
                        return res.status(200).json(comment)
                    } else {
                        return res.status(404).json({ 'error': 'no comment found' })
                    }
                })
                .catch(function (err) {
                    console.log(err);
                    res.status(500).json({ "error": "invalid fields" });
                })
        


    },
    deleteComment: (req, res) => {
        let commentId = req.params.commentId


        models.Publication.findOne({
            where: {id: commentId}
        })
        .then((commentFound) => {
            if (commentFound) {
                models.Comment.destroy({
                    where: { id: commentId}
                })
                .then((deleteComment) => {
                    return res.status(201).json({
                        message: 'comment successffuly deleted'
                    })
                })
                .catch((err) => {
                    return res.status(500).json({ 'error': 'cannot delete this comment'})
                })
            } else {
                return res.status(400).json({'error': 'comment not exist'})
            }
        })
    },
}
