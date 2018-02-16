import db from './db';
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var companies = require('./routes/companies');
var auth = require('./routes/auth');
var item = require('./routes/item');
var receipt = require('./routes/receipt');
var inventory = require('./routes/inventory');
var customers = require('./routes/customers');
var app = express();

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'client/build')));
app.use('/api/customers', customers);
app.use('/api/companies', companies);
app.use('/api/auth', auth);
app.use('/api/item', item);
app.use('/api/receipt', receipt);
app.use('/api/inventory', inventory);


const port = 5000;

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.listen(port, function (error) {
  if (error) throw error;
  db.query("INSERT IGNORE INTO customer (id, fname,lname,email) VALUES(-1,'','','No Info Provided');");
  console.log('Express server listening on port', port);
});