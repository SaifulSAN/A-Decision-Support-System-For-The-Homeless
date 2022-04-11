const Organization = require('../models/model.organization');
const { pool } = require('../dbConfig');
const bcrypt = require('bcrypt');
const { hash } = require('bcrypt');
const saltRounds = 12;
const jwt = require('jsonwebtoken');
require('dotenv').config();

//function to register organization only
exports.RegisterOrganization = async (req,res,next) => {
    res.write('Registering organization...');

    let { name, primary_contact_number, secondary_contact_number, email, password } = req.body;
    
    //hash + salt pw
    const salt = await bcrypt.genSalt(saltRounds);
    const hash_pw = await bcrypt.hash(password, salt);

    try{
        const [text, values] = Organization.InsertOrganization(name, primary_contact_number, secondary_contact_number, email, hash_pw);
        await pool.query(text, values);
    } catch (err){
        console.log(err.stack);
        next(err);
    }   
}

exports.OrgLogin = async (req,res,next) => {
    let { email, password } = req.body;

    if(!email || !password){
        return res.status(400).json({'message': 'Email and password are required!'});
    }
    
    try {
        const [text, values] = Organization.CheckUserExistEmail(email)
        let query_result = await pool.query(text, values);
        const organization_exists = query_result.rows[0].exists;
        

        if(organization_exists){
            try {
                const [text, values] = Organization.LoginOrgPasswordCmp(email)
                let query_result = await pool.query(text, values);
                const hashed_pw = query_result.rows[0].organization_password;
                const foundOrgId = query_result.rows[0].organization_id;
                const match = await bcrypt.compare(password, hashed_pw);
                if (match){
                    //JWT
                    const accessToken = jwt.sign(
                        { "id" : foundOrgId },
                        process.env.ACCESS_TOKEN_SECRET_ORG,
                        {expiresIn: '1h'}
                    );
                    const refreshToken = jwt.sign(
                        { "id" : foundOrgId },
                        process.env.REFRESH_TOKEN_SECRET_ORG,
                        {expiresIn: '14 days'}
                    );

                    try {
                        const [text, values] = Organization.StoreOrgRefreshToken(foundOrgId, refreshToken)
                        await pool.query(text, values);

                        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 14 * 24 * 60 * 60 * 1000});
                        res.json({accessToken});
                    } catch (err) {
                        console.log(err)
                    }
                } else {
                    res.sendStatus(401);
                }
            } catch (err) {
                console.log(err);
            }
        } else {
            res.sendStatus(401);
        }
    } catch (err) {
        console.log(err);
    }
}