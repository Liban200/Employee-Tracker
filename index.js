const inquirer = require('inquirer');
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Dallas123$',
    database:'employeeData_db',
},
console.log(`Connected to the courses_db database.`)
);

db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database: ' + err.stack);
      return;
    }
    console.log('Connected to the employeeData database.');
    promptChoices();
  });
function promptChoices() {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'choice',
          message: 'Choose the function you would like to execute.',
          choices: [
            'View Departments',
            'View Employees',
            'View Roles',
            'Add Role',
            'Add Department',
            'Add Employee',
            'Update Employee Role',
            'End',
          ],
        },
      ])
      .then(handleChoice)
      .catch((error) => {
        console.error('Error occurred during prompt:', error);
        promptChoices();
      });
  }
  
  function handleChoice(response) {
    const choice = response.choice;
    switch (choice) {
      case 'View Departments':
        viewDepartments();
        break;
      case 'View Employees':
        viewEmployees();
        break;
      case 'View Roles':
        viewRoles();
        break;
      case 'Add Department':
        addDepartment();
        break;
      case 'Add Role':
        addRole();
        break;
      case 'Add Employee':
        addEmployee();
        break;
      case 'Update Employee Role':
        updateEmployeeRole();
        break;
      case 'End':
        db.end();
        break;
      default:
        console.log('Invalid choice. Please select a valid option.');
        promptChoices();
    }
  }

  function viewDepartments() {
    db.query('SELECT * FROM departments', (err, results) => {
      if (err) {
        console.error('Error retrieving departments from the database:', err);
        promptChoices();
        return;
      }
  
      console.log('Departments:');
      results.forEach((department) => {
        console.log(`- ${department.department_name}`);
      });
  
      promptChoices();
    });
  }

  function viewRoles() {
    db.query('SELECT * FROM roles', (err, results) => {
      if (err) {
        console.error('Error retrieving roles from the database:', err);
        promptChoices();
        return;
      }
  
      console.log('Roles:');
      results.forEach((role) => {
        console.log(`- ${role.role_title}`);
      });
  
      promptChoices();
    });
  }
  
  function viewEmployees() {
    db.query('SELECT * FROM employees', (err, results) => {
      if (err) {
        console.error('Error retrieving employees from the database:', err);
        promptChoices();
        return;
      }
  
      console.log('Employees:');
      results.forEach((employee) => {
        console.log(`- ${employee.first_name} ${employee.last_name}`);
      });
  
      promptChoices();
    });
  }
  
  function addDepartment() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'departmentName',
          message: 'Enter the name of the department:',
        },
      ])
      .then((response) => {
        const departmentName = response.departmentName;
        db.query(
          'INSERT INTO departments (name) VALUES (?)',
          [departmentName],
          (err) => {
            if (err) {
              console.error('Error adding department to the database:', err);
            } else {
              console.log(`Department '${departmentName}' added successfully.`);
            }
            promptChoices();
          }
        );
      })
      .catch((error) => {
        console.error('Error occurred during department addition:', error);
        promptChoices();
      });
  }

  function addRole() {
    db.query("SELECT department_id, department_name FROM departments", (err, departments) => {
      if (err) {
        console.error('Error retrieving departments from the database:', err);
        promptChoices();
        return;
      }
  
      inquirer
        .prompt([
          {
            name: "departmentId",
            type: "list",
            message: "Which department does this role belong to?",
            choices: departments.map(({ department_id, department_name }) => ({
              name: department_name,
              value: department_id,
            })),
          },
          {
            name: "role_title",
            type: "input",
            message: "What is the name of the role?",
          },
          {
            name: "role_salary",
            type: "input",
            message: "What is the salary for this role?",
            validate: (salaryValue) => !isNaN(salaryValue) || "\n Enter a numerical value \n",
          },
        ])
        .then(({ departmentId, role_title, role_salary }) => {
          db.query(
            "INSERT INTO roles (role_title, salary, department_id) VALUES (?, ?, ?)",
            [role_title, role_salary, departmentId],
            (err) => {
              if (err) {
                console.error('Error adding role to the database:', err);
                promptChoices();
                return;
              }
              console.log(`\n ${role_title} has been added in Employee_Info database. \n`);
              promptChoices();
            }
          );
        })
        .catch((error) => {
          console.error('Error occurred during role addition:', error);
          promptChoices();
        });
    });
  }
  
  function addEmployee() {
    db.query("SELECT role_id, role_title FROM roles", (err, roles) => {
      if (err) {
        console.error('Error retrieving roles from the database:', err);
        promptChoices();
        return;
      }
  
      inquirer
        .prompt([
          {
            name: "firstName",
            type: "input",
            message: "Enter the first name of the employee:",
          },
          {
            name: "lastName",
            type: "input",
            message: "Enter the last name of the employee:",
          },
          {
            name: "roleId",
            type: "list",
            message: "Select the role for the employee:",
            choices: roles.map(({ role_id, role_title }) => ({
              name: role_title,
              value: role_id,
            })),
          },
          {
            name: "managerId",
            type: "list",
            message: "Select the manager for the employee:",
            choices: [
              { name: "None", value: null },
              ...roles.map(({ role_id, role_title }) => ({
                name: role_title,
                value: role_id,
              })),
            ],
          },
        ])
        .then(({ firstName, lastName, roleId, managerId }) => {
          db.query(
            "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
            [firstName, lastName, roleId, managerId],
            (err) => {
              if (err) {
                console.error('Error adding employee to the database:', err);
                promptChoices();
                return;
              }
              console.log(`Employee '${firstName} ${lastName}' added successfully.`);
              promptChoices();
            }
          );
        })
        .catch((error) => {
          console.error('Error occurred during employee addition:', error);
          promptChoices();
        });
    });
  }
  
  function updateEmployeeRole() {
    db.query("SELECT employee_id, CONCAT(first_name, ' ', last_name) AS full_name FROM employees", (err, employees) => {
      if (err) {
        console.error('Error retrieving employees from the database:', err);
        promptChoices();
        return;
      }
  
      db.query("SELECT role_id, role_title FROM roles", (err, roles) => {
        if (err) {
          console.error('Error retrieving roles from the database:', err);
          promptChoices();
          return;
        }
  
        inquirer
          .prompt([
            {
              name: "employeeId",
              type: "list",
              message: "Select the employee to update:",
              choices: employees.map(({ employee_id, full_name }) => ({
                name: full_name,
                value: employee_id,
              })),
            },
            {
              name: "roleId",
              type: "list",
              message: "Select the new role for the employee:",
              choices: roles.map(({ role_id, role_title }) => ({
                name: role_title,
                value: role_id,
              })),
            },
          ])
          .then(({ employeeId, roleId }) => {
            db.query(
              "UPDATE employees SET role_id = ? WHERE employee_id = ?",
              [roleId, employeeId],
              (err) => {
                if (err) {
                  console.error('Error updating employee role in the database:', err);
                  promptChoices();
                  return;
                }
                console.log(`Employee with ID ${employeeId} has been updated to the new role.`);
                promptChoices();
              }
            );
          })
          .catch((error) => {
            console.error('Error occurred during employee role update:', error);
            promptChoices();
          });
      });
    });
  }
  





