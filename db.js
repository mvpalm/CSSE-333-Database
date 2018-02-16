// Update with your config settings.
var mysql = require('mysql');
let connect = {
    host: "127.0.0.1",
        user: "root",
        password: "",
        database: "Project"
};
let name = "localdb";

var connection = mysql.createConnection({
  ...connect,
  multipleStatements: true,
});

connection.connect(function (err) {
  if (err) throw err;
  console.log(`Connected to ${name}!`);
});
export default connection;
