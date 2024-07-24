const { Pool } = require("pg");
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.CONNECT
  });

module.exports = pool