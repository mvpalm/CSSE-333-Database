// Update with your config settings.
var mysql = require('mysql');
let connect = {
    host: "127.0.0.1",
        user: "root",
        password: "Project333",
        database: "DigitalReceipt"
};
let name = "";

var connection = mysql.createConnection({
  ...connect,
  multipleStatements: true,
});

connection.connect(function (err) {
  if (err) throw err;
  console.log(`Connected to ${name}!`);
});
export default connection;
