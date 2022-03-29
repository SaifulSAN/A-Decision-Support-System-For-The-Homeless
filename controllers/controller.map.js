const Request = require('../models/model.request');
const { pool } = require('../dbConfig');

//receives json from onClick event from frontend, then inserts into database
exports.InsertRequest = async (req,res,next) => {
    res.write('Inserting request...');

    let { coordinate_x, coordinate_y, note, requesting_user } = req.body;

    try {
        const [text, values] = Request.InsertRequest(coordinate_x, coordinate_y, note, requesting_user);
        await pool.query(text, values);
        res.write('Successfully inserted!');
        res.end();

    } catch (err){
        console.log(err);
        next(err);
    }
}

//retrieves all active requests for current authenticated user
exports.GetActiveRequests = async (req,res,next) => {
    res.write('Retrieving requests...');

    let { user_id } = req.body;

    try{
        const [text, values] = Request.GetActiveRequests(user_id);
        await pool.query(text, values);
        res.write('Requests retrieved!');
        res.end();

    } catch(err){
        console.log(err);
        next(err);
    }
}

//receives json from user "deleting" their request, sets request active flag in database to false for soft deletion
exports.DeleteRequest = async (req,res,next) => {
    res.write('Deleting request...');

    let { user_id } = req.body;

    try{
        const [text, values] = Request.SetRequestStatusInactive(user_id);
        await pool.query(text, values);
        res.write('Request deleted!');
        res.end();
    } catch(err){
        console.log(err);
        next(err);
    }
}