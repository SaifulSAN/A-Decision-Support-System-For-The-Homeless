const Organization = require('../models/model.organization');
const { pool } = require('../dbConfig');
const bcrypt = require('bcrypt');
const { hash } = require('bcrypt');
const saltRounds = 12;

exports.UpdateOrgDetails = async (req,res,next) => {
    //res.write("Updating user details...");

    let id = req.user;
    let { name, primary_contact_number, secondary_contact_number, email } = req.body.data;

    try {
        let [text, values] = Organization.UpdateOrganization(id, name, primary_contact_number, secondary_contact_number, email);
        await pool.query(text, values);
        res.json({"message": "Successfully updated"});

    } catch (err) {
        if(err.constraint == 'organization_organization_email_key'){
            res.json({"message": "ERROR: Email already in use!! Unique email needed."});
        }
        console.log(err);
        next(err);
    }
}

exports.GetOrgDetails = async (req,res,next) => {
    //res.write('fetching user details...')

    let id = req.user;

    try {
        let [text, values] = Organization.GetOrganization(id);
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

    let id = req.user;
    let { old_password, new_password } = req.body;

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