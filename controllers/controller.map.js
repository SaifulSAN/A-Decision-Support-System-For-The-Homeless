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
exports.GetActiveRequestsUser = async (req,res,next) => {
    res.write('Retrieving requests...');

    let { user_id } = req.body;

    try{
        const [text, values] = Request.GetActiveRequestsUser(user_id);
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

//calculates optimal placement of all given points (ONLY FOR ORGANIZATION)
exports.CalculateOptimalPlacement = async (req,res,next) => {
    res.write('Calculating...')
    class Point {

        constructor(xVal, yVal){
            this.xVal = Number(xVal);
            this.yVal = Number(yVal);
        }
    }

    function sumDistance(Point, setOfPoints, n){

        let sum = 0;
        for (let i = 0; i < n; i++){
            diffX = Math.abs(setOfPoints[i]["xVal"] - Point["xVal"]);
            diffY = Math.abs(setOfPoints[i]["yVal"] - Point["yVal"]);
            sum = sum + Math.sqrt((diffX * diffX) + (diffY * diffY));
        }
    
        return sum;
    }

    function calcGeoMedian(setOfPoints, n){

        let pointSet = [];
        pointSet.push(new Point(-1.0, 0.0));
        pointSet.push(new Point(0.0, 1.0));
        pointSet.push(new Point(1.0, 0.0));
        pointSet.push(new Point(0.0, -1.0));
    
        lower_limit = 0.01;
    
        let curr_point = new Point;
    
        for (let i = 0; i < n; i++){
    
            if( Number.isNaN(curr_point["xVal"]) || Number.isNaN(curr_point["yVal"])){
                curr_point["xVal"] = setOfPoints[i]["xVal"];
                curr_point["yVal"] = setOfPoints[i]["yVal"];
            }
            else{
                curr_point["xVal"] = curr_point["xVal"] + setOfPoints[i]["xVal"];
                curr_point["yVal"] = curr_point["yVal"] + setOfPoints[i]["yVal"];
            }
        }
    
        //calculate centroid and place curr_point as centroid
        curr_point["xVal"] = curr_point["xVal"] / n;
        curr_point["yVal"] = curr_point["yVal"] / n;
    
        //minimumDistance is sum of all distance of curr_point operating as centroid to all points in set
        let minimumDistance = sumDistance(curr_point, setOfPoints, n);
    
        let j = 0;
        while(j<n){
    
            for (let i = 0; i < n, i != j; i++){
                let movedPoint = new Point;
                movedPoint["xVal"] = setOfPoints[i]["xVal"];
                movedPoint["yVal"] = setOfPoints[i]["yVal"];
                newDistance = sumDistance(movedPoint, setOfPoints, n);
    
                if(newDistance < minimumDistance){
                    minimumDistance = newDistance;
                    curr_point["xVal"] = movedPoint["xVal"];
                    curr_point["yVal"] = movedPoint["yVal"];
                }
            }
            j++;
        }
    
        test_distance = 1000;
        flag = 0;
    
        while (test_distance > lower_limit){
            flag = 0
    
            for(let i = 0; i < 4; i++){
                let movedPoint = new Point;
                movedPoint["xVal"] = curr_point["xVal"] + test_distance * pointSet[i]["xVal"];
                movedPoint["yVal"] = curr_point["yVal"] + test_distance * pointSet[i]["yVal"];
    
                let newDistance = sumDistance(movedPoint, setOfPoints, n);
    
                if(newDistance < minimumDistance){
                    minimumDistance = newDistance;
                    curr_point["xVal"] = movedPoint["xVal"];
                    curr_point["yVal"] = movedPoint["yVal"];
                    flag = 1;
                    break;
                }
            }
    
            if (flag==0){
                test_distance = test_distance / 2;
            }
        }
    
        
        //console.log("Optimized point is at coordinate (" + curr_point["xVal"] + ", " + curr_point["yVal"]+")");
        //console.log("Minimum total distance from all points: ", minimumDistance);
        let dataOutput = { curr_point, minimumDistance };
        return dataOutput;
    }

    let requestCount = 0;
    let requestArray = [];

    try {
        let [text] = Request.GetActiveRequestsOrg();
        let queryresult = await pool.query(text);

        //get number of rows of requests retrieved from database which are ACTIVE
        requestCount = queryresult.rows.length;

        //populate array with requests as Point objects
        queryresult.rows.forEach((element) => {
            requestArray.push(new Point(element.request_coordinate_x, element.request_coordinate_y))
        })

    } catch(err) {
        console.log(err);
        next(err);
    }
    
    if(requestCount > 0){
        res.write(calcGeoMedian(requestArray, requestCount));
        res.end()
    }
    else {
        res.write('No active requests found.')
        res.end();
    }

}