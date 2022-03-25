module.exports = app => {
    const login = require('../controllers/controller.login');
    const router = require('express').Router();

    router.get('/favicon.ico', (req,res) =>{
        return 'your faveicon';
    })

    router.get('/login', (req,res) =>{
        res.send('/login working right now');
    })

    router.post('/register', login.RegisterUser);

    app.use('/', router);
}