const express = require('express');
const httpApp = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('log-timestamp');

require('dotenv').config();

httpApp.use(cors({credentials:true, origin: 'http://localhost:3000'}));
httpApp.use(express.json());

httpApp.use(cookieParser());

require('./routes/route.auth.js')(httpApp);
require('./routes/route.refresh')(httpApp);
require('./routes/route.logout')(httpApp);


require('./routes/route.userhome.js')(httpApp);
require('./routes/route.orghome')(httpApp);

httpApp.listen(8080, ()=>{
    console.log('Listening on port 8080')
});