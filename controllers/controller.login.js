const AppUser = require('../models/model.appuser');
const Organization = require('../models/model.organization');
const { pool } = require('../dbConfig');
const bcrypt = require('bcrypt');
const { hash } = require('bcrypt');
const saltRounds = 12;

//function to register USER ONLY (org uses different)
exports.RegisterUser = async (req,res,next) => {
    res.write('Registering user...');
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
        await pool.query(text, values);
        res.write("Successfully registered!");
    } catch (err){
        if(err.constraint == 'app_user_user_email_key'){
            res.write("ERROR: Email already registered!!")
        }
        if(err.constraint == 'app_user_user_phone_number_key'){
            res.write("ERROR: Phone number already registered!!")
        }
        next(err);
    }
    
}

//TODO: REMEMBER TO MOVE THIS TO USER DETAILS PAGE, THIS IS NOT FOR RESETTING PASSWORD IF YOU FORGOT
//USE A PROPER JWT METHOD TO DO THE ABOVE
// exports.UpdateUserPassword = async (req,res,next) => {
//     res.send('Updating password...');

//     let { id, old_password, new_password } = req.body;

//     const salt = await bcrypt.genSalt(saltRounds);
//     const new_hash_pw = await bcrypt.hash(new_password, salt);

//     try{
//         let [text, values] = AppUser.GetUserPasswordHashed(id);
//         const query_result = await pool.query(text, values);

//         let old_hash_pw = query_result.rows[0].user_password;
//         // console.log(old_hash_pw);
//         // console.log(old_password);

//         if (bcrypt.compare(old_password, old_hash_pw)){
//             try{
//                 let [text, values] = AppUser.UpdateUserPassword(id, new_hash_pw);
//                 const update_query = await pool.query(text, values);
//                 // console.log(update_query.rows[0].user_password)
//             } catch (err) {
//                 console.log(err.stack);
//                 next(err);
//             }
//         }

//     } catch (err) {
//         console.log(err.stack);
//         next(err);
//     }
// }

//function to register organization only
exports.RegisterOrganization = async (req,res,next) => {
    res.send('Registering organization...');
    //res.send(req.body);

    let { name, primary_contact_number, secondary_contact_number, email, password } = req.body;
    // console.log(name);
    // console.log(phone_number);
    // console.log(email);
    // console.log(password);
    
    //hash + salt pw
    const salt = await bcrypt.genSalt(saltRounds);
    const hash_pw = await bcrypt.hash(password, salt);

    // console.log(hash_pw);

    try{
        const [text, values] = Organization.InsertOrganization(name, primary_contact_number, secondary_contact_number, email, hash_pw);
        await pool.query(text, values);
    } catch (err){
        console.log(err.stack);
        next(err);
    }
    
}



