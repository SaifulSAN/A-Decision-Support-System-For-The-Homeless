const express = require('express');
const httpApp = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('log-timestamp');

require('dotenv').config();

httpApp.use(cors());
httpApp.use(express.json());

httpApp.use(cookieParser());

require('./routes/route.auth.js')(httpApp);
require('./routes/route.refreshuser')(httpApp);
require('./routes/route.logoutuser')(httpApp);


require('./routes/route.userhome.js')(httpApp);

httpApp.listen(8080, ()=>{
    console.log('Listening on port 8080')
});