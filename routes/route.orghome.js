module.exports = app => {
    const orgHome = require('../controllers/controller.orghome');
    const router = require('express').Router();
    const verifyJwtOrg = require('../middleware/jwtverifyorg');
    const orgMap = require('../controllers/controller.orgmap')

    router.get('/favicon.ico', (req,res) =>{
        return 'your faveicon';
    })

    //router.put('/userupdatepw', verifyJwtOrg, orgHome.UpdateUserPassword);
    //router.put('/userupdatedetails', verifyJwtOrg, orgHome.UpdateUserDetails);
    //router.get('/getuserdetails', verifyJwtOrg, orgHome.GetUserDetails);
    router.get('/optimal', verifyJwtOrg, orgMap.CalculateOptimalPlacement);
    router.get('/orgactiverequests', verifyJwtOrg, orgMap.GetAllActiveRequests);
    router.put('/orgupdatedetails', verifyJwtOrg, orgHome.UpdateOrgDetails)
    router.get('/orgdetails', verifyJwtOrg, orgHome.GetOrgDetails)


    app.use('/', router);
}