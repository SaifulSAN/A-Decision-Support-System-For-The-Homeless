module.exports = app => {
    const router = require('express').Router();
    const refreshTokenUser = require('../controllers/controller.refreshuser');
    const refreshTokenOrg = require('../controllers/controller.refreshorg');

    router.get('/favicon.ico', (req,res) =>{
        return 'your faveicon';
    })

    router.get('/refreshuser', refreshTokenUser.UserRefresh);
    router.get('/refreshorg', refreshTokenOrg.OrgRefresh);

    app.use('/', router);
}