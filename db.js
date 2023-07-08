/** Database connection for messagely. */


// const { Client } = require("pg");
// const { DB_URI } = require("./config");

// const client = new Client(DB_URI);

// client.connect();


// module.exports = client;

const pg = require("pg");

const db = new pg.Client({
  user: "test",
  password: "test123",
  host: "localhost",
  port: 5432,
  database: "messagely"
});

db.connect();

module.exports = db;
