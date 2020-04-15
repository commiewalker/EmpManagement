DROP DATABASE IF EXISTS employeeTracker_DB;
CREATE database employeeTracker_DB;

USE employeeTracker_DB;

CREATE TABLE department(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE role(
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL (10,2) NULL,
    department_id INT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id)
    REFERENCES department(id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NULL ,
  
  PRIMARY KEY (id),
  
  FOREIGN KEY (role_id)
  REFERENCES role(id),

    FOREIGN KEY (manager_id)
    REFERENCES employee(id)
);

INSERT INTO department (name) Value ("Engineering"), ("Sales"), ("Finance"), ("Legal");

INSERT INTO role (title, salary, department_id) Value ("Software Engineer", 70000, 1), ("LEAD Engineer", 100000, 1), ("Accountant", 65000.50, 3), ("Accountant LEAD", 98765.43, 3), ("Salesperson", 43000.75, 2), ("Sales LEAD", 65412.75, 2), ("Lawyer", 80000, 4), ("Lawyer LEAD", 100000, 4);

INSERT INTO employee (first_name, last_name, role_id)
Value("Bob Lee", "Swagger", 2), ("John", "Wick", 4), ("Dom", "Cobb", 6), ("Jack", "Sparrow", 8);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
Value("Jason", "Bourne", 1, 2), ("Jack", "Reacher", 3, 4), ("Bryan", "O'conner", 5, 6), ("Han", "Lue", 7, 8);

