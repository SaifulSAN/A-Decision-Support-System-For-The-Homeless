module.exports = class Request {
    constructor(id, coordinate_x, coordinate_y, note, handling_org, handling_station, requesting_user){
        this.id = id;
        this.coordinate_x = coordinate_x;
        this.coordinate_y = coordinate_y;
        this.note = note;
        this.handling_org = handling_org;
        this.handling_station = handling_station;
        this.requesting_user = requesting_user;
        this.request_active = true; //default value
        //boolean value that determines whether request is currently active or not
    }

    static InsertRequest(coordinate_x, coordinate_y, note, requesting_user){
        const text = `
        INSERT INTO request(request_coordinate_x, request_coordinate_y, request_note, requesting_user)
        VALUES ($1, $2, $3, $4) RETURNING request_id`

        const values = [coordinate_x, coordinate_y, note, requesting_user];
        return [text, values];
    }

    //for user to get their active requests
    static GetActiveRequestsUser(id){
        const text = `
        SELECT request_coordinate_x, request_coordinate_y, request_note 
        FROM request 
        WHERE (requesting_user = $1 AND request_active IS TRUE)`

        const values = [id];
        return [text, values];
    }

    //for org to get active requests
    static GetActiveRequestsOrg(){
        const text = `
        SELECT request_coordinate_x, request_coordinate_y 
        FROM request 
        WHERE (request_active IS TRUE)`

        return [text];
    }

    static SetRequestStatusInactiveOnInsert(id){
        const text = `
        UPDATE request SET request_active = FALSE WHERE requesting_user = $1`

        const values = [id];
        return [text, values];
    }

    //TODO: allow users to edit request details on the fly? or just delete + remake new request
    //static UpdateRequest()

    static SetRequestStatusInactiveOnDemand(id){
        const text = `
        UPDATE request SET request_active = FALSE WHERE request_id = $1`

        const values = [id];
        return [text, values];
    }

}