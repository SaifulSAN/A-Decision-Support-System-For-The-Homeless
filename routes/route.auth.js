module.exports = app => {
    const authUser = require('../controllers/controller.authuser');
    const authOrg = require('../controllers/controller.authorg');
    const router = require('express').Router();

    router.get('/favicon.ico', (req,res) =>{
        return 'your faveicon';
    })

    router.get('/login', (req,res) =>{
        res.send('/login working right now');
    })

    router.post('/loginuser', authUser.UserLogin);
    router.post('/registeruser', authUser.RegisterUser);
    router.post('/loginorg', authOrg.OrgLogin);
    router.post('/registerorg', authOrg.RegisterOrganization);

    app.use('/', router);
}