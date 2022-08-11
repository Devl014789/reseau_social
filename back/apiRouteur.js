let express = require('express');
let usersCtrl = require('./routes/usersCtrl');
let likesCtrl = require('./routes/likesCtrl');
let publicationCtrl = require('./routes/publicationCtrl');
let commentsCtrl = require('./routes/commentsCtrl');


exports.router = ( () => {
    let apiRouteur = express.Router();

    apiRouteur.route('/user/register/').post(usersCtrl.register);
    apiRouteur.route('/user/login/').post(usersCtrl.login);
    apiRouteur.route('/user/logout/').get(usersCtrl.Logout);
    apiRouteur.route('/getuser/').get(usersCtrl.GetUser);
    apiRouteur.route('/updateuser/').put(usersCtrl.UpdateUser);
    apiRouteur.route('/deleteuser/').delete(usersCtrl.DeleteUser);


    apiRouteur.route('/post/new/').post(publicationCtrl.createPost);
    apiRouteur.route('/post/').get(publicationCtrl.listPost);
    apiRouteur.route('/post/:id/delete/').delete(publicationCtrl.deletePost);

    apiRouteur.route('/post/:id/comment/new/').post(commentsCtrl.createComment);
    apiRouteur.route('/post/:id/comment/').get(commentsCtrl.listComment);
    apiRouteur.route('/post/:id/comment/:commentid/delete').delete(commentsCtrl.deleteComment);

    apiRouteur.route('/post/:publicationId/vote/like').post(likesCtrl.likePost)
    apiRouteur.route('/post/:publicationId/vote/dislike').post(likesCtrl.dislikePost)

    return apiRouteur;
})();