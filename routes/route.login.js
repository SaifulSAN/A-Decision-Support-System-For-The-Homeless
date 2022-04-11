module.exports = app => {
    const login = require('../controllers/controller.login');
    const authUser = require('../controllers/controller.authuser');
    const router = require('express').Router();

    router.get('/favicon.ico', (req,res) =>{
        return 'your faveicon';
    })

    router.get('/login', (req,res) =>{
        res.send('/login working right now');
    })

    router.post('/loginuser', authUser.UserLogin);
    router.post('/registeruser', authUser.RegisterUser);

    app.use('/', router);
}