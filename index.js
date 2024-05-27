const express = require('express');
const inquirer = require('inquirer');
const { Pool } = require('pg');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const pool = new Pool(
  {
    user: 'postgres',
    password: 'Thumper1!',
    host: 'localhost',
    database: 'company_db'
},
)

pool.connect();

//These are the menu functions for the different options the user will have to interact with the data.
function getDepartments(){
    pool.query('SELECT * FROM department', function (err, {rows}) {
        console.table(rows);
        tracker();
        });
    };

function getEmployees(){
    pool.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary, CONCAT(manager.first_name,' ',manager.last_name) as manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department = department.id LEFT JOIN employee manager on manager.id = employee.manager_id",
     function (err, {rows}) {
        console.table(rows);
        tracker();
        });
    };


function getRoles(){
    pool.query('SELECT role.title, role.id, department.name, role.salary FROM role LEFT JOIN department on role.department = department.id', function (err, {rows}) {
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

function addRole(){
    var deptList = [] ;
    pool.query(`SELECT id, name FROM department`, (err, {rows})=>{
        let depts = rows;
       for (let i = 0; i < depts.length; i++){
        deptList.push({name: depts[i].name, value: depts[i].id});
       }
    });
    inquirer.prompt([{
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
        name: 'department',
        message: 'What department is this position in?',
        choices: deptList
    }
]).then((answer) => {
        pool.query(`INSERT INTO role(title, salary, department) VALUES ($1, $2, $3)`, 
        [`${answer.roleName}`, `${answer.salary}`, `${answer.department}`],
        function(err,res){
            if (err) {console.log(err)}
            else console.log('New role added')}
        )
        tracker();
    })
}



function addEmployee(){
    var roleList = [] ;
    pool.query(`SELECT id, title FROM role`, (err, {rows})=>{
        let titles = rows;
       for (let i = 0; i < titles.length; i++){
        roleList.push({name: titles[i].title, value: titles[i].id});
       }
    });
    var employeeList = [];
    pool.query(`SELECT id, first_name, last_name FROM employee`, (err, {rows})=>{
        let managers = rows;
        for (let i = 0; i < managers.length; i++){
            employeeList.push({name: managers[i].first_name + ' '+ managers[i].last_name, value: managers[i].id})
        }

    })

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
            pool.query(`INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`, [`${answer.firstName}`,`${answer.lastName}`,`${answer.role}`,`${answer.manager}`],
             function(err,res){
                if (err) {console.log(err)}
                else console.log('New employee added');
                tracker();
            })
                }
    )
}; 


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

//Menu options

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

//displays following array
console.log('Employee Tracker!');
tracker();

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  /*console.log(`Server running on port ${PORT}`); */
});