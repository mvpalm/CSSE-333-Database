import db from './db';

var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var inventory = require('./routes/inventory');


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'client/build')));


app.use('/api/inventory', inventory);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/client/index.html'));
});

const port = process.env.PORT || 5000;
 
app.listen(port, function (error) {
    if (error) throw error;
    console.log('Express server listening on port', port);
});