const inquirer = require("inquirer");
const mysql = require("mysql2/promise");
const cTable = require("console.table");

const connectionOptions = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "foo",
  database: "company_db",
};

// Set inquirer questions
let questions = [
  {
    type: "list",
    name: "question",
    message: "What would you like to do?",
    choices: [
      "View employees",
      "View roles",
      "View departments",
      "Add employee",
      "Add role",
      "Add department",
      "Update employee role",
    ],
  },
];

// CLI functions
let showEmployees = async () => {
  let [result] = await db.query(
    `SELECT employees.id, 
        employees.first_name, 
        employees.last_name,
        roles.title,
        roles.salary,
        departments.name AS department,
        CONCAT(managers.first_name, " ", managers.last_name) AS manager
    FROM employees
    INNER JOIN roles ON employees.role_id = roles.id 
    INNER JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees managers ON managers.id = employees.manager_id
    ORDER BY employees.id`
  );
  console.table(result);
  if (result) mainCommand();
};

// roles.title,
// roles.salary,
// roles.department,
// departments.name AS department

let showRoles = async () => {
  let [result] = await db.query(
    "SELECT roles.id, roles.title AS role, salary, departments.name AS department FROM roles INNER JOIN departments ON roles.department_id = departments.id"
  );
  console.table(result);
  if (result) mainCommand();
};

let showDepartments = async () => {
  let [result] = await db.query(
    "SELECT departments.id, name AS department FROM departments"
  );
  console.table(result);
  if (result) mainCommand();
};

let addEmployee = async () => {
  let [roles] = await db.query("SELECT roles.id, title FROM roles");
  let rolesList = roles.map((item) => item.title);

  let [persons] = await db.query(
    `SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employees`
  );
  let personsList = persons.map((item) => item.name);
  let personsArray = persons.map((item) => {
    return { id: item.id, name: item.name };
  });

  const employeeQuestions = [
    {
      name: "first_name",
      message: "What is the employee's first name?",
    },
    {
      name: "last_name",
      message: "What is their last name?",
    },
    {
      type: "list",
      name: "role",
      message: "What is their role?",
      choices: rolesList,
    },
    {
      type: "list",
      name: "manager",
      message: "Who is their manager?",
      choices: personsList,
    },
  ];

  let answers = await inquirer.prompt(employeeQuestions);

  let selectedRole = roles.find((item) => item.title == answers.role);

  let manager = personsArray.find((item) => item.name == answers.manager);

  let result = [
    answers.first_name,
    answers.last_name,
    selectedRole.id,
    manager.id,
  ];

  let foo = await db.query(
    "INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
    result
  );

  console.log(`Employee ${result[0]} ${result[1]} successfully added`);

  if (foo) mainCommand();
};

let addDepartment = async () => {
  let answer = await inquirer.prompt([
    { name: "departmentName", message: "What is department's name?" },
  ]);
  let foo = await db.query("INSERT INTO departments (name) VALUES (?)", [
    answer.departmentName,
  ]);
  console.log(`Added department: ${answer.departmentName}`);
  if (foo) mainCommand();
};

let addRole = async () => {
  let [departments] = await db.query("SELECT id, name FROM departments");
  let departmentsList = departments.map((item) => item.name);

  const roleQuestions = [
    {
      name: "title",
      message: "What is the role's title?",
    },
    {
      name: "salary",
      message: "What is the role's salary? Please enter an integer",
    },
    {
      type: "list",
      name: "department",
      message: "What is the role's department?",
      choices: departmentsList,
    },
  ];

  let answers = await inquirer.prompt(roleQuestions);

  while (!parseInt(answers.salary)) {
    console.log("Please enter an integer value for the salary");
    let answer = await inquirer.prompt([
      { name: "salary", message: "What is the role's salary?" },
    ]);
    answers.salary = answer.salary;
  }

  let selectedDepartment = departments.find(
    (item) => item.name == answers.department
  );

  let results = [answers.title, answers.salary, selectedDepartment.id];

  let foo = await db.query(
    "INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)",
    results
  );

  console.log(`Added role: ${answers.title}`);
  if (foo) mainCommand();
};

let changeEmployeeRole = async () => {
  let [persons] = await db.query(
    `SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employees`
  );
  let personsList = persons.map((item) => item.name);
  let personsArray = persons.map((item) => {
    return { id: item.id, name: item.name };
  });

  let [roles] = await db.query("SELECT roles.id, title FROM roles");
  let rolesList = roles.map((item) => item.title);

  const changeRoleQuestions = [
    {
      type: "list",
      name: "employee",
      message: "Which employee would you like to change?",
      choices: personsList,
    },
    {
      type: "list",
      name: "newRole",
      message: "What is their new role?",
      choices: rolesList,
    },
  ];

  let answers = await inquirer.prompt(changeRoleQuestions);

  let selectedRole = roles.find((item) => item.title == answers.newRole);
  let person = personsArray.find((item) => item.name == answers.employee);

  let foo = await db.query("UPDATE employees SET role_id = ? WHERE id = ?", [
    selectedRole.id,
    person.id,
  ]);

  console.log(`${answers.employee} is now a ${answers.newRole}`);

  if (foo) mainCommand();
};

// Main command
let mainCommand = async () => {
  const mainQuestion = [
    {
      type: "list",
      name: "command",
      message: "What would you like to do?",
      choices: [
        "View all employees",
        "View all roles",
        "View all departments",
        "Add an employee",
        "Add a role",
        "Add a department",
        "Update an employee's role",
      ],
    },
  ];
  let answer = await inquirer.prompt(mainQuestion);
  switch (answer.command) {
    case "View all employees":
      showEmployees();
      break;
    case "View all roles":
      showRoles();
      break;
    case "View all departments":
      showDepartments();
      break;
    case "Add an employee":
      addEmployee();
      break;
    case "Add a role":
      addRole();
      break;
    case "Add a department":
      addDepartment();
      break;
    case "Update an employee's role":
      changeEmployeeRole();
      break;
  }
};

let db; // variable to hold the database connection object
mysql
  .createConnection(connectionOptions)
  .then((connection) => {
    db = connection;
    console.log("connected to DB as id " + connection.threadId);
    mainCommand();
  })
  .catch((err) => {
    console.log("error connecting to DB: " + err.stack);
    process.exit(1); // Quit node if there is no DB connection
  });
