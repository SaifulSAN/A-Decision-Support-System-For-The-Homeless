const Items = require('../models/model.item');
const { pool } = require('../dbConfig');

exports.InsertItem = async (req, res, next) => {

    const { itemArray } = req.body.data;
    const { requestId } = req.body;
    //console.log(itemArray);

    if(itemArray.length > 0){

        itemArray.forEach(async element => {
            try {
                let [text, values] = Items.InsertItem(element.item, element.quantity, requestId);
                await pool.query(text, values);
                //res.sendStatus(204);
            } catch (err) {
                console.log(err);
                console.log('itemArray not following format of { "item" : <value>, "quantity": <value> }');
            }
        });

        res.json({'message': 'Succesfully inserted new request with items.'})

    } else {
        res.json({'message': 'Succesfully inserted new request.'})
    }

}