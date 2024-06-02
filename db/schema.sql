DROP DATABASE IF EXISTS company_db;
CREATE DATABASE company_db;

\c company_db;

CREATE TABLE department(
    id SERIAL PRIMARY KEY NOT NULL, 
    name VARCHAR(30)
);

CREATE TABLE role(
    id SERIAL PRIMARY KEY NOT NULL, 
    title VARCHAR(30),
    salary DECIMAL,
    department_id INTEGER,
    FOREIGN KEY (department_id)
    REFERENCES department(id)
    ON DELETE SET NULL
);

CREATE TABLE employee(
    id SERIAL PRIMARY KEY NOT NULL, 
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER,
    manager_id INTEGER REFERENCES employee(id), 
    FOREIGN KEY (role_id)
    REFERENCES role(id)
    ON DELETE SET NULL
);