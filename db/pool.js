const { Pool } = require("pg");
require('dotenv').config();

/*module.exports = new Pool({
    host: "localhost", 
    user: "postgres",
    database: "top_users",
    password: process.env.PASSWORD,
    port: 5432 
  });*/

  module.exports = new Pool({
    connectionString: process.env.CONNECT
  });