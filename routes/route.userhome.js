module.exports = app => {
    
    var router = require('express').Router();

    router.get('/favicon.ico', (req,res) =>{
        return 'your faveicon';
    })

    router.get('/home', (req,res) =>{
        res.send('working right now')
    });

    app.use('/', router);
}