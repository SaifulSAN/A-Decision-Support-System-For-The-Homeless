module.exports = class Item {
    constructor(id, name, quantity, for_request){
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.for_request = for_request;
    }

    static InsertItem(name, quantity, for_request){
        const text = `
        INSERT INTO item(item_name, item_quantity, for_request)
        VALUES ($1, $2, $3)`

        const values = [name, quantity, for_request];
        return [text, values];
    }

    static UpdateItem

    static DeleteItem

    static
}