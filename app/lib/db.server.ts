import mysql from "mysql2/promise";

// Create and export a connection pool
export const db = mysql.createPool({
  host: "127.0.0.1",
  user: "root",          // <-- change if your DB user is different
  password: "12345",          // <-- your MySQL/MariaDB password
  database: "dream_db" // <-- use the DB name you created earlier
});
