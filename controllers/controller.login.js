const AppUser = require('../models/model.appuser');
const Organization = require('../models/model.organization');
const { pool } = require('../dbConfig');
const bcrypt = require('bcrypt');
const { hash } = require('bcrypt');
const saltRounds = 12;

//function to register USER ONLY (org uses different)
exports.RegisterUser = async (req,res,next) => {
    //res.send('Registering user...');
    //res.send(req.body);

    let { name, phone_number, email, password } = req.body;
    // console.log(name);
    // console.log(phone_number);
    // console.log(email);
    // console.log(password);
    
    //hash + salt pw
    const salt = await bcrypt.genSalt(saltRounds);
    const hash_pw = await bcrypt.hash(password, salt);

    // console.log(hash_pw);

    try{
        const [text, values] = AppUser.InsertUser(name, phone_number, email, hash_pw);
        const query = await pool.query(text, values);
    } catch (err){
        console.log(err.stack);
        next(err);
    }
    
}

