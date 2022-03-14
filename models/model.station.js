module.exports = class Station {
    constructor(id, name, coordinate_x, coordinate_y, handling_org){
        this.id = id;
        this.name = name;
        this.coordinate_x = coordinate_x;
        this.coordinate_y = coordinate_y;
        this.handling_org = handling_org;
        this.station_active = true; //default value
        //TODO: add boolean attribute to station, true for active stations, false for station no longer in use
        //stations no longer in use will be removed from map
    }

    //used when station is generated after being calculated
    static InsertStation(name, coordinate_x, coordinate_y, handling_org){
        const text = `
        INSERT INTO station(station_name, station_coordinate_x, station_coordinate_y, handling_org)
        VALUES ($1, $2, $3, $4)`

        const values = [name, coordinate_x, coordinate_y, handling_org];
        return [text, values];
    }

    static SetStationStatus(id, bool){
        //TODO: set station available attribute to false, therefore disabling station
        const text = `
        UPDATE station SET station_active = $2 WHERE station_id = $1`

        const values = [id, bool];
        return [text, values];
    }
}