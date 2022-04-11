const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyJwtUser = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader){
        return res.sendStatus(401);
    }
    //console.log(authHeader);
    console.log('here')
    const token = authHeader.split(' ')[1];
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET_USER,
        (err, decoded) => {
            if (err){
                console.log('heeeerreee')
                return res.sendStatus(403);
            }
            req.user = decoded.id;
            //console.log(req.user);
            next();
        }
    );
}

module.exports = verifyJwtUser;