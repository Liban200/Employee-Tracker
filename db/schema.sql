DROP DATABASE IF EXISTS employeeData_db;
CREATE DATABASE employeeData_db;

USE employeeData_db;



CREATE TABLE departments (
department_id INT  AUTO_INCREMENT PRIMARY KEY,
department_name VARCHAR(30)
);

CREATE TABLE roles (
    role_id INT  AUTO_INCREMENT PRIMARY KEY,
    role_title VARCHAR(30),
    salary DECIMAL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

CREATE TABLE employees (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(role_id),
    FOREIGN KEY (manager_id) REFERENCES employees(employee_id)
);

/*SELECT
  employees.employee_id AS EMPLOYEE_ID,
  employees.first_name AS FIRST_NAME,
  employees.last_name AS LAST_NAME,
  roles.role_id AS ROLE_ID,
  roles.role_title AS JOB_TITLE,
  roles.salary AS SALARY,
  departments.department_name AS DEPARTMENT,
  departments.department_id AS DEPARTMENT_ID,
  employees.manager_id AS MANAGER
FROM
  employees
JOIN
  roles ON employees.role_id = roles.role_id
JOIN
  departments ON roles.department_id = departments.department_id;


