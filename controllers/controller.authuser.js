const AppUser = require('../models/model.appuser');
const { pool } = require('../dbConfig');
const bcrypt = require('bcrypt');
const { hash } = require('bcrypt');
const saltRounds = 12;
const jwt = require('jsonwebtoken');
require('dotenv').config();

//function to register USER ONLY (org uses different)
exports.RegisterUser = async (req,res,next) => {
    res.write('Registering user...');

    let { name, phone_number, email, password } = req.body;
    
    //hash + salt pw
    const salt = await bcrypt.genSalt(saltRounds);
    const hash_pw = await bcrypt.hash(password, salt);

    try{
        const [text, values] = AppUser.InsertUser(name, phone_number, email, hash_pw);
        await pool.query(text, values);
        res.write("Successfully registered!");
        res.end();
    } catch (err){
        if(err.constraint == 'app_user_user_email_key'){
            res.write("ERROR: Email already registered!!")
            res.end();
        }
        if(err.constraint == 'app_user_user_phone_number_key'){
            res.write("ERROR: Phone number already registered!!")
            res.end();
        }
        next(err);
    }   
}

exports.UserLogin = async (req,res,next) => {
    let { email, password } = req.body;

    if(!email || !password){
        return res.status(400).json({'message': 'Email and password are required!'});
    }
    
    try {
        const [text, values] = AppUser.CheckUserExistEmail(email)
        let query_result = await pool.query(text, values);
        const user_exists = query_result.rows[0].exists;
        

        if(user_exists){
            try {
                const [text, values] = AppUser.LoginUserPasswordCmp(email)
                let query_result = await pool.query(text, values);
                const hashed_pw = query_result.rows[0].user_password;
                const foundUserId = query_result.rows[0].user_id;
                const match = await bcrypt.compare(password, hashed_pw);
                if (match){
                    //JWT
                    const accessToken = jwt.sign(
                        { "userInfo" : {
                            "id" : foundUserId,
                            "role" : 2170 }
                        },
                        process.env.ACCESS_TOKEN_SECRET_USER,
                        {expiresIn: '1h'}
                    );
                    const refreshToken = jwt.sign(
                        { "userInfo" : {
                            "id" : foundUserId,
                            "role" : 2170 }
                        },
                        process.env.REFRESH_TOKEN_SECRET_USER,
                        {expiresIn: '14 days'}
                    );

                    try {
                        const [text, values] = AppUser.StoreUserRefreshToken(foundUserId, refreshToken)
                        await pool.query(text, values);

                        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 14 * 24 * 60 * 60 * 1000});
                        res.json({accessToken, "roles" : [2170, 1]});
                    } catch (err) {
                        console.log(err)
                    }
                } else {
                    res.status(401);
                    res.json({'message':'Incorrect email and/or password!'});
                }
            } catch (err) {
                console.log(err);
            }
        } else {
            res.status(401);
            res.json({'message':'User not found!'});
        }
    } catch (err) {
        console.log(err);
    }
}