module.exports = app => {
    const router = require('express').Router();
    const refreshTokenUser = require('../controllers/controller.refreshuser');

    router.get('/favicon.ico', (req,res) =>{
        return 'your faveicon';
    })

    router.get('/refreshuser', refreshTokenUser.UserRefresh);

    app.use('/', router);
}