const express = require('express');
const httpApp = express();
require('log-timestamp');

require('dotenv').config();

httpApp.use(express.json());

require('./routes/route.login.js')(httpApp);
require('./routes/route.userhome.js')(httpApp);

httpApp.listen(8080, ()=>{
    console.log('Listening on port 8080')
});