const express = require('express');
const bodyParser = require("body-parser");
const router = require('./routes/routing.js');
const myErrorLogger = require('./utilities/errorlogger')
const myRequestLogger = require('./utilities/requestlogger')

const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use(myRequestLogger);
app.use('/', router);
app.use(myErrorLogger);

app.listen(3000);
console.log("Server started for Express Wallet at 3000");

module.exports = app