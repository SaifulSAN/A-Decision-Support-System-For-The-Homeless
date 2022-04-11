const AppUser = require('../models/model.appuser');
const Point = require('../controllers/algo');
const { pool } = require('../dbConfig');
const bcrypt = require('bcrypt');
const { hash } = require('bcrypt');
const { query } = require('express');
const saltRounds = 12;

exports.UpdateUserDetails = async (req,res,next) => {
    res.write("Updating user details...");

    let { id, name, phone_number, email, emergency_contact_number, emergency_contact_name } = req.body;

    try {
        let [text, values] = AppUser.UpdateUser(id, name, phone_number, email, emergency_contact_number, emergency_contact_name);
        await pool.query(text, values);
        res.write("Successfully updated!");
        res.end();

    } catch (err) {
        if(err.constraint == 'app_user_user_email_key'){
            res.write("ERROR: Email already in use!! Unique email needed.");
            res.end();
        }
        if(err.constraint == 'app_user_user_phone_number_key'){
            res.write("ERROR: Phone number already in use!! Unique phone number needed.");
            res.end();
        }
        console.log(err);
        next(err);
    }
}

exports.GetUserDetails = async (req,res,next) => {
    //res.write('fetching user details...')

    let id = req.user;

    try {
        let [text, values] = AppUser.GetUserDetails(id);
        const query_results = await pool.query(text, values);
        //console.log(query_results.rows[0].user_name);
        res.send(query_results.rows[0]);
    } catch (err) {
        console.log(err);
        next(err);
    }
}

exports.UpdateUserPassword = async (req,res,next) => {
    res.write('Updating password...');

    let { id, old_password, new_password } = req.body;

    const salt = await bcrypt.genSalt(saltRounds);
    const new_hash_pw = await bcrypt.hash(new_password, salt);

    try{
        let [text, values] = AppUser.GetUserPasswordHashed(id);
        const query_result = await pool.query(text, values);

        let old_hash_pw = query_result.rows[0].user_password;
        // console.log("old hash is: ", old_hash_pw);
        // console.log("new hash is: ", new_hash_pw);
        // console.log(old_password);

        if (await bcrypt.compare(old_password, old_hash_pw)){
            //console.log("TRUE!")
            try{
                let [text, values] = AppUser.UpdateUserPassword(id, new_hash_pw);
                const update_query = await pool.query(text, values);
                res.write('Successfully updated password!!');
                res.end();
            } catch (err) {
                console.log(err.stack);
                next(err);
            }
        }
        else {
            res.write('Current passwords do not match. Password change denied!!');
            res.end();
        }

    } catch (err) {
        console.log(err.stack);
        next(err);
    }
}

//remember to delete
exports.Give = async (req,res,next) => {
    //res.write('testing returns');

    try{
        let [text] = AppUser.Give();
        const queryresult = await pool.query(text);
        console.log(queryresult.rows);
        const count = queryresult.rows.length;
        console.log(count);
        //console.log(queryresult.rows[0]);
        //res.send(queryresult);
    } catch (err) {
        console.log(err.stack);
        next(err);
    }
}