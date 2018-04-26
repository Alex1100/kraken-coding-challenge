const express = require('express');
const logger = require('morgan');
const db = require('./config/database').db;
const bodyParser = require('body-parser');
const app = express();
const routes = require('./config/routes');
const PORT = 5000;
const HOST = '0.0.0.0';

app.use(routes);
app.use(logger('dev'));
app.use(bodyParser.json());

const server = app.listen(PORT, HOST);

