-- MariaDB schema for shareholders table
CREATE TABLE IF NOT EXISTS shareholders (
  fn_id VARCHAR(20) NOT NULL PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
