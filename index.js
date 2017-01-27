const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const router = require('./router');
const mongoose = require('mongoose');
const cors = require('cors');

//DB Setup
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:auth/auth');

//App Setup
//Express Middleware
app.use(morgan('combined')); //Morgan is logging framework on server
app.use(cors());
app.use(bodyParser.json({ type: '*/*' })) //Parse any incoming request as json
router(app);


//Server Setup
const port = process.env.PORT || 3090;
const server = http.createServer(app);
server.listen(port);
console.log('Server listening on port:', port);