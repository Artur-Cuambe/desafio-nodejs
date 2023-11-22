const express = require('express');
const routes = require('./routes');
const bodyParser = require('body-parser');
const app = express();

// console.log(routes);
app.use(bodyParser.json());
app.use(routes);
module.exports = app;
