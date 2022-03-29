module.exports = app => {
    const userhome = require('../controllers/controller.userhome');
    const router = require('express').Router();

    router.get('/favicon.ico', (req,res) =>{
        return 'your faveicon';
    })

    router.get('/home', (req,res) =>{
        res.send('working right now')
    });

    router.put('/updatepw', userhome.UpdateUserPassword);
    router.put('/userupdate', userhome.UpdateUserDetails);

    app.use('/', router);
}