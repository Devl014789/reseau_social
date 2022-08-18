let models = require('../.././models');
let jwtUtiles = require('../../utiles/jwt.Utiles')
let asyncLib = require('async');
const { generateTokenForUser, getUserId } = require('../../utiles/jwt.Utiles');

module.exports = {
  
    likePost: (req, res) => {
        let token = req.cookies.jwt;
        res.cookie('jwt', token, { httpOnly: true });
        let userId = jwtUtiles.getUserId(token);
        let publicationId = req.params.id

        models.Like.findOne({
          where: {
            userId: userId,
            publicationId: publicationId
          }
        })
          .then((like) => {
            if (!like) {
              models.Like.create({
                userId: userId,
                publicationId: publicationId,
              })
                .then((like) => {
                    res.status(201).json(like);
                })
                .catch((err) => {console.log(err);
                  res.status(500).json({ error: "Cannot like post" });
                });
            } else {
              models.Like.destroy({
                where: { userId: userId, publicationId: publicationId },
              })
                .then((like) => {
                    res.status(201).json({
                      like,
                      message:'like success deleted'
                    });
                })
                .catch((err) => {
                  res.status(500).json({ error: "Cannot delete like" });
                });
            }
          })
          .catch((err) => {            
            res.status(500).json({ error: "Cannot fetch like" });
          });
      },
}











