const Request = require('../models/model.request');
const { pool } = require('../dbConfig');

//receives json from onClick event from frontend, then inserts into database
exports.InsertRequest = async (req,res,next) => {

    let id = req.user;
    let { coordinate_x, coordinate_y, note } = req.body.data;

    try {
        const [text, values] = Request.SetRequestStatusInactiveOnInsert(id);
        await pool.query(text, values);

        try {

            const [text, values] = Request.InsertRequest(coordinate_x, coordinate_y, note, id);
            let query_results = await pool.query(text, values);
            const requestId = query_results.rows[0].request_id;
        
            req.body.requestId = requestId;
            //res.json({'message': 'Succesfully inserted new request.'})
            next();
            
        } catch (err) {
            console.log(err);
            res.json({'message': 'ERROR: Request insertion unsuccessful.'})
        }

    } catch (err){
        console.log(err);
        res.json({'message': 'ERROR: Request insertion unsuccessful.'})
        //next(err);
    }
}

//retrieves all active requests for current authenticated user
exports.GetActiveRequestsUser = async (req,res,next) => {
    res.write('Retrieving requests...');

    let id = req.user;

    try{
        const [text, values] = Request.GetActiveRequestsUser(id);
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

    let id = req.user;

    try{
        const [text, values] = Request.SetRequestStatusInactive(id);
        await pool.query(text, values);
        res.write('Request deleted!');
        res.end();
    } catch(err){
        console.log(err);
        next(err);
    }
}

