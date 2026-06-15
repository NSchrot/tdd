const express = require('express');
const cors = require('cors');
const app = express();
const apiRoutes = require('./routes/Routes');

app.use(cors());
app.use(express.json());
app.use(apiRoutes);

module.exports = app;