module.exports = app => {
    const router = require('express').Router();
    const logOutUser = require('../controllers/controller.logoutuser');

    router.get('/favicon.ico', (req,res) =>{
        return 'your faveicon';
    })

    router.get('/logoutuser', logOutUser.UserLogout);

    app.use('/', router);
}