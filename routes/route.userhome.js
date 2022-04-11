module.exports = app => {
    const userhome = require('../controllers/controller.userhome');
    const router = require('express').Router();
    const verifyJwtUser = require('../middleware/jwtverifyuser');

    router.get('/favicon.ico', (req,res) =>{
        return 'your faveicon';
    })

    router.get('/home', (req,res) =>{
        res.send('working right now')
    });

    router.put('/updatepw', userhome.UpdateUserPassword);
    router.put('/userupdate', userhome.UpdateUserDetails);
    router.get('/userdetails', verifyJwtUser, userhome.GetUserDetails);
    router.get('/give', userhome.Give); //remember to delete

    app.use('/', router);
}