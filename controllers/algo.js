module.exports = class Point {

    constructor(xVal, yVal){
        this.xVal = Number(xVal);
        this.yVal = Number(yVal);
    }
}

let pointSet = [];
pointSet.push(new Point(-1.0, 0.0));
pointSet.push(new Point(0.0, 1.0));
pointSet.push(new Point(1.0, 0.0));
pointSet.push(new Point(0.0, -1.0));

lower_limit = 0.01;

// testPoint = new Point(10, 10);

// console.log(testPoint["xVal"]);
// console.log(testPoint["yVal"] + 2);

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
    let curr_point = new Point;

    //console.log("BEFORE", curr_point);

    //console.log("SET OFFFF", setOfPoints[i]);

    for (let i = 0; i < n; i++){

        if( Number.isNaN(curr_point["xVal"]) || Number.isNaN(curr_point["yVal"])){
            curr_point["xVal"] = setOfPoints[i]["xVal"];
            curr_point["yVal"] = setOfPoints[i]["yVal"];
        }
        else{
            curr_point["xVal"] = curr_point["xVal"] + setOfPoints[i]["xVal"];
            curr_point["yVal"] = curr_point["yVal"] + setOfPoints[i]["yVal"];
        }

        // curr_point["xVal"] = curr_point["xVal"] + setOfPoints[i]["xVal"];
        // curr_point["yVal"] = curr_point["yVal"] + setOfPoints[i]["yVal"];
        // console.log("IT IS NOW", i);
        // console.log(setOfPoints[i]);

        //console.log(curr_point);
    }

    //console.log("HEREREEE", curr_point);

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

    console.log("Optimized point is at coordinate (" + curr_point["xVal"] + ", " + curr_point["yVal"]+")");
    console.log("Minimum total distance from all points: ", minimumDistance);
}