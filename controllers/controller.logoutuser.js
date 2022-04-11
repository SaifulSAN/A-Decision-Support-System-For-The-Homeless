const AppUser = require('../models/model.appuser');
const { pool } = require('../dbConfig');

exports.UserLogout = async (req,res,next) => {
    
    const cookies = req.cookies;

    if(!cookies?.jwt){
        return res.sendStatus(204);
    } else {

        const refreshToken = cookies.jwt;
    
        try {
            const [text, values] = AppUser.LogoutUser(refreshToken)
            await pool.query(text, values);
            return res.sendStatus(204)
            
        }   catch (err) {
            console.log(err);
            res.clearCookie('jwt', {httpOnly: true, maxAge: 14 * 24 * 60 * 60 * 1000} )
            return res.sendStatus(204)
        }
    }
}