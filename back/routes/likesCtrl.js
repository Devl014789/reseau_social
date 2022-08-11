let models = require('../.././models');
let jwtUtiles = require('../../utiles/jwt.Utiles')
let asyncLib = require('async');
const { generateTokenForUser, getUserId } = require('../../utiles/jwt.Utiles');



module.exports = {
    // likePost: (req, res) => {
    //     let token = req.cookies.jwt;
    //     res.cookie('jwt', token, { httpOnly: true });
    //     let UserId = jwtUtiles.getUserId(token)
    //     let PublicationId = req.params.id;

    //     if (PublicationId <= 0) {
    //         return res.status(400).json({ 'error': 'Invalide Parameters' })
    //     }


    //         // (publicationId, userId, done) => {
    //         //     if (userId) {
    //         //         models.like.findOne({
    //         //             where: {
    //         //                 userId: UserId,
    //         //                 publicationId: PublicationId
    //         //             }
    //         //         })
    //         //         .then((isUserAlreadyLiked) => {
    //         //             done(null, publicationId, userId, isUserAlreadyLiked);
    //         //         })
    //         //         .catch((err) => {
    //         //             return res.status(500).json({ 'error': 'unable to verify is user already liked'});
    //         //         })
    //         //     } else {
    //         //         return res.status(404).json({ 'error': 'user not exist'})
    //         //     }
    //         // },
    //         // (publicationId, userId, isUserAlreadyLiked, done) => {
    //         //     if(!isUserAlreadyLiked) {
    //         //         publicationId.addUser(userId)
    //         //         .then((alreadyLikeFound) => {
    //         //             done(null, publicationId, userId, isUserAlreadyLiked, alreadyLikeFound)
    //         //         })
    //         //         .catch((err) => {
    //         //             return res.status(500).json({ 'error': 'unable to set user reaction'});
    //         //         })
    //         //     } else {
    //         //         return res.status(409).json({ 'error': ' post already liked'})
    //         //     }
    //         // },
    //         // (publicationId, userId, done) => {
    //             models.Publication.update({
    //                 like: id.like + 1,
    //             })
    //             .then ((isliked) => {
    //                 // done(publicationId, userId)
    //                 return res.status(201).json(isliked)
    //             })
    //             .catch((err) => {
    //                 return res.status(500).json({ 'error': 'cannot update post liked counter'})
    //             })
    //         // },
    //         // (publicationId) => {
    //         //     if (publicationId) {
    //         //         return res.status(201).json(publicationId);
    //         //     } else {
    //         //         return res.status(500).json({ 'error': 'cannot update post like'})
    //         //     }
    //         // }
    // },
    // dislikePost: (req, res) => {
    //     let headerAuth = req.headers['authorization'];
    //     let userId = jwtUtiles.getUserId(headerAuth);
    //     let publicationId = parseInt(req.query.publicationId);

    //     if (publicationId <= 0) {
    //         return res.status(400).json({ 'error': 'Invalide Parameters' })
    //     }

    //     asyncLib.waterfall([                
    //         (publicationId, done) => {
    //             if (publicationId) {
    //                 models.user.findOne({
    //                     where: { id: userId }
    //                 })
    //                     //receherche publication 
    //                     .then((userId) => {
    //                         done(null, publicationId, userId)
    //                     })
    //                     .catch((err) => {
    //                         return res.status(500).json({ 'error': 'unable to verify user' });
    //                     })
    //             } else {
    //                 return res.status(404).json({ 'error': 'post already liked' });
    //             }
    //         },
    //         (publicationId, userId, done) => {
    //             if (userId) {
    //                 models.like.findOne({
    //                     where: {
    //                         userId: userId,
    //                         publicationId: publicationId
    //                     }
    //                 })
    //                 .then((isUserAlreadyLiked) => {
    //                     done(null, publicationId, userId, isUserAlreadyLiked);
    //                 })
    //                 .catch((err) => {
    //                     return res.status(500).json({ 'error': 'unable to verify is user already liked'});
    //                 })
    //             } else {
    //                 return res.status(404).json({ 'error': 'user not exist'})
    //             }
    //         },//57180
    //         (publicationId, userId, isUserAlreadyLiked, done) => {
    //             if(isUserAlreadyLiked) {
    //                 isUserAlreadyLiked.destroy()
    //                 .then(() => {
    //                     done(null, publicationId, userId)
    //                 })
    //                 .catch((err) => {
    //                     return res.status(500).json({ 'error': 'cannot remove already liked post'})
    //                 })
    //             } else {
    //                 return res.status(409).json({ 'error': ' post already liked'})
    //             }
    //         },
    //         (publicationId, userId, done) => {
    //             publicationId.update({
    //                 like: publicationId.like - 1,
    //             })
    //             .then (() => {
    //                 done(publicationId)
    //             })
    //             .catch((err) => {
    //                 return res.status(500).json({ 'error': 'cannot update post liked counter'})
    //             })
    //         },
    //         (publicationId) => {
    //             if (publicationId) {
    //                 return res.status(201).json(publicationId);
    //             } else {
    //                 return res.status(500).json({ 'error': 'cannot update post like'})
    //             }
    //         }
    //     ])
    // }
    likePost: (req, res) => {
        let token = req.cookies.jwt;
        res.cookie('jwt', token, { httpOnly: true });
        let userId = jwtUtiles.getUserId(token);
        let publicationId = req.params.id
    console.log(userId);
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











