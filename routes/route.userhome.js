module.exports = app => {
    const userhome = require('../controllers/controller.userhome');
    const router = require('express').Router();
    const verifyJwtUser = require('../middleware/jwtverifyuser');

    router.get('/favicon.ico', (req,res) =>{
        return 'your faveicon';
    })

    router.put('/userupdatepw', verifyJwtUser, userhome.UpdateUserPassword);
    router.put('/userupdatedetails', verifyJwtUser, userhome.UpdateUserDetails);
    router.get('/getuserdetails', verifyJwtUser, userhome.GetUserDetails);

    
    router.get('/give', userhome.Give); //remember to delete

    app.use('/', router);
}