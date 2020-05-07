-- Drops the company_db if it already exists --
DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

-- Use the DB company_db for all the rest of the script
USE company_db;



CREATE TABLE departments
(
  id INTEGER
  AUTO_INCREMENT NOT NULL,
  name VARCHAR
  (30) NOT NULL,
  PRIMARY KEY
  (id)
);

  CREATE TABLE roles
  (
    id INTEGER
    AUTO_INCREMENT NOT NULL,
  title VARCHAR
    (30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INTEGER NOT NULL,
  PRIMARY KEY
    (id),
  FOREIGN KEY
    (department_id) REFERENCES departments
    (id)
);


    CREATE TABLE employees
    (
      id INTEGER
      AUTO_INCREMENT NOT NULL,
  first_name VARCHAR
      (30) NOT NULL,
  last_name VARCHAR
      (30) NOT NULL,
  role_id INTEGER NOT NULL,
  manager_id INTEGER,
  PRIMARY KEY
      (id),
  FOREIGN KEY
      (role_id) REFERENCES roles
      (id),
  FOREIGN KEY
      (manager_id) REFERENCES employees
      (id)
);