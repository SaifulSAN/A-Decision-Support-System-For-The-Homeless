module.exports = app => {
    const userHome = require('../controllers/controller.userhome');
    const router = require('express').Router();
    const verifyJwtUser = require('../middleware/jwtverifyuser');
    const userMap = require('../controllers/controller.usermap');
    const Item = require('../controllers/controller.items');

    router.get('/favicon.ico', (req,res) =>{
        return 'your faveicon';
    })

    router.put('/userupdatepw', verifyJwtUser, userHome.UpdateUserPassword);
    router.put('/userupdatedetails', verifyJwtUser, userHome.UpdateUserDetails);
    router.get('/getuserdetails', verifyJwtUser, userHome.GetUserDetails);
    router.post('/newrequest', verifyJwtUser, userMap.InsertRequest, Item.InsertItem);
    router.get('/activerequest', verifyJwtUser, userMap.GetActiveRequestsUser);

    
    //router.get('/give', userhome.Give); //remember to delete

    app.use('/', router);
}