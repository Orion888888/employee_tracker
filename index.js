
const inquirer = require('inquirer');
const { Pool } = require('pg');


// PostgreSQL connection configuration
const pool = new Pool({
    user: 'postgres',
    password: 'Thumper1!',
    host: 'localhost',
    database: 'company_db'
});
pool.connect();

//these are the functions for the menu 
function getDepartments(){
  pool.query('SELECT * FROM department', function (err, {rows}) {
      if (err) {
          console.error(err);
          return;
      }
      console.table(rows);
      tracker();
  });
}

function getEmployees(){
    pool.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, CONCAT(manager.first_name,' ',manager.last_name) as manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;",
     function (err, {rows}) {
        console.table(rows);
        tracker();
        });
    };


function getRoles(){
    pool.query('SELECT role.title, role.id, department.name, role.salary FROM role LEFT JOIN department on role.department_id = department.id', function (err, {rows}) {
            console.table(rows);
            tracker();
            });
    };


function addDepartment(){
    inquirer.prompt([{
        type: 'input',
        name: 'deptName',
        message: 'What department would you like to add?'
    }]).then((answer) => {console.log(answer.deptName);
    pool.query(`INSERT INTO department(name) VALUES($1)`, [`${answer.deptName}`], function(err,res){
        if (err) {console.log(err)}
        else console.log('New department added');
        tracker();
    })
        })
    };

    async function addRole(){
      var deptList = [] ;
      try {
          const { rows: depts } = await pool.query(`SELECT id, name FROM department`);
          deptList = depts.map(dept => ({ name: dept.name, value: dept.id }));
      } catch (err) {
          console.error(err);
          return;
      }
  
      inquirer.prompt([
          {
              type: 'input',
              name: 'roleName',
              message: 'What is the title of the new role?'
          },
          {
              type: 'input',
              name: 'salary',
              message: 'What is the salary for this position?'
          },
          {
              type: 'list',
              name: 'department_id',
              message: 'What department is this position in?',
              choices: deptList
          }
      ]).then((answer) => {
          pool.query(`INSERT INTO role(title, salary, department_id) VALUES ($1, $2, $3)`, 
          [answer.roleName, answer.salary, answer.department_id],
          function(err, res){
              if (err) {
                  console.log(err);
              } else {
                  console.log('New role added');
              }
              tracker();
          });
      });
  }

function addEmployee(){
  var roleList = [] ;
  pool.query(`SELECT id, title FROM role`, (err, {rows})=>{
      if (err) {
          console.log(err);
          return;
      }
      let titles = rows;
      for (let i = 0; i < titles.length; i++){
          roleList.push({name: titles[i].title, value: titles[i].id});
      }

      var employeeList = [];
      pool.query(`SELECT  * FROM employee`, (err, {rows})=>{
          if (err) {
              console.log(err);
              return;
          }
          let managers = rows;
          for (let i = 0; i < managers.length; i++){
              employeeList.push({name: managers[i].first_name + ' '+ managers[i].last_name, value: managers[i].id});
          }

          inquirer.prompt(
              [
                  {
                      type: 'input',
                      name: 'firstName',
                      message: "What is the employee's first name?"
                  },
                  { 
                      type: 'input',
                      name: 'lastName',
                      message: "What is the employee's last name?"                
                  },
                  {
                      type: 'list',
                      name: 'role',
                      message: 'What role should the employee have?',
                      choices: roleList
                  },
                  {
                      type: 'list',
                      name: 'manager',
                      message: "Who is the employee's manager?",
                      choices: employeeList
                  }
              ]
          ).then(
              (answer) => {
                  pool.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`, 
                  [`${answer.firstName}`,`${answer.lastName}`,`${answer.role}`,`${answer.manager}`],
                  function(err,res){
                      if (err) {console.log(err)}
                      else console.log('New employee added');
                      tracker();
                  })
              }
          );
      });
  });
}

function updateEmployee(){
    var empList = [];
    var roleUpdateList = [];
    pool.query('SELECT id, first_name, last_name FROM employee', (err, {rows}) => {
        let empls = rows;
        if (err) {
            throw err
        } else{
        empList = empls.map(({id, first_name, last_name}) => ({
            name: `${first_name} ${last_name}`,
            value: id,})
        )
        pool.query('SELECT title, id FROM role', (err, {rows}) => {
            roleUpdateList = rows.map(({id, title}) => ({
                name: title,
                value: id,
            }))
            inquirer.prompt(
                [
                    {
                        type: 'list',
                        name: 'employeeUpdate',
                        message: 'Which employee would you like to update?',
                        choices: empList
                    },{
                        type: 'list',
                        name: 'updatedRole',
                        message: "What should the employees new role be?",
                        choices: roleUpdateList
                    }

                ]
            ).then((answer) =>{
                pool.query('UPDATE employee SET role_id = ($1) WHERE id = ($2)', [`${answer.updatedRole}`,`${answer.employeeUpdate}`], function(err, res){if (err) {console.log(err)}
                else console.log('Employee role updated');
                tracker()})
            }
            )
        }
        )
    }
}
    )
}

//these are the options for the user when interacting with the menu.

const tracker = () => {
    inquirer.prompt(
        [
            {
             type: 'list',
             name: 'activity',
             message: 'What would you like to do?',
             choices: ["View all departments", 
             "View all employees",
             "View all roles",
             "Add a department",
             "Add an employee",
             "Add a role", 
             "Update an employee role",
             "Quit"]
            }
         ]
    ).then((choice) => {
        switch (choice.activity){
           case "View all departments": getDepartments();
           break;
           case 'View all employees': getEmployees();
           break;
           case 'View all roles': getRoles();
           break;
           case 'Add a department': addDepartment();
           break;
           case 'Add a role': addRole();
           break;
           case 'Add an employee': addEmployee();
           break;
           case 'Update an employee role': updateEmployee();
           break;
           case 'Quit': console.log("Thank you for using Employee Tracker!");
               break;
           }
      })
};

//displays
console.log('Employee Tracker!');
tracker();

