module.exports = class Request {
    constructor(id, coordinate_x, coordinate_y, note, handling_org, handling_station, requesting_user){
        this.id = id;
        this.coordinate_x = coordinate_x;
        this.coordinate_y = coordinate_y;
        this.note = note;
        this.handling_org = handling_org;
        this.handling_station = handling_station;
        this.requesting_user = requesting_user;
        //TODO: change handling org from NOT NULL to normal in postgres
        //TODO: change handling station from NOT NULL to normal in postgres
        //TODO: add boolean value that determines whether request is currently active or not
    }

    static InsertRequest(coordinate_x, coordinate_y, note, requesting_user){
        const text = `
        INSERT INTO request(request_coordinate_x, request_coordinate_y, request_note, requesting_user)
        VALUES ($1, $2, $3, $4)`

        const values = [coordinate_x, coordinate_y, note, requesting_user];
        return [text, values];
    }

    //TODO: allow users to edit request details on the fly? or just delete + remake new request
    //static UpdateRequest()

    static DeleteRequest(bool){
        //TODO: add boolean value that determines whether request is currently active or not
    }
}