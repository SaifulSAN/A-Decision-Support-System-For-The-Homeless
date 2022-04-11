const AppUser = require('../models/model.appuser');
const { pool } = require('../dbConfig');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.UserRefresh = async (req,res,next) => {
    
    const cookies = req.cookies;

    if(!cookies?.jwt){
        return res.sendStatus(401);
    }

    const refreshToken = cookies.jwt;
    
        try {
            const [text, values] = AppUser.FindUserRefreshToken(refreshToken)
            let query_result = await pool.query(text, values);
            const token_exists = query_result.rows[0].user_id;
            
            if(token_exists){
                jwt.verify(
                    refreshToken,
                    process.env.REFRESH_TOKEN_SECRET_USER,
                    (err, decoded) => {
                        if (err || token_exists !== decoded.id){
                            return res.sendStatus(403);
                        }
                        const accessToken = jwt.sign(
                            { "id": decoded.id},
                            process.env.ACCESS_TOKEN_SECRET_USER,
                            { expiresIn: '1h'}
                        );
                        res.json({accessToken})
                    }
                )
            } else {
                return res.sendStatus(403);
            }
        }   catch (err) {
            console.log(err);
        }
}