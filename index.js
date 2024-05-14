const inquire = require('inquirer');
const { initQ, viewByQ, empQs, getR } = require('./helpers/questions'); // Import getR from questions module
const pool = require('./db/connections'); // Import the pool object

let eList = [];
let dList = [];
let rList = [];

const setEList = () => {
  eList = [];
  pool.query( // Changed connection.query to pool.query
    `SELECT CONCAT(first_name, ' ', last_name) AS name FROM employee`,
    (err, data) => {
      if (err) throw err;
      eList = data.rows.map(row => row.name); // Use data.rows
      eList.push('None');
    }
  );
};

const setDList = () => {
	pool.query( // Changed connection.query to pool.query
	  `SELECT name FROM department`, // Change dept_name to name
	  (err, data) => {
		if (err) throw err;
		dList = data.rows.map(row => row.name); // Use data.rows
		console.log(dList);
	  }
	);
};

function whatToDo() {
  inquire.prompt(initQ).then((answers) => {
    console.log(answers);
    switch (answers.wdywtd) {
      case 'View All Employees (sort by)':
        displayEmployees();
        break;
      case 'Add Employee':
        addEmployee();
        break;
      case 'Remove Employee':
        removeEmployee();
        break;
      case 'Update Employee Role':
        updateRole();
        break;
      case 'Update Employee Manager':
        updateMgr();
        break;
      case 'View Total Utilized Budget By Department':
        viewBudgetByDept();
        break;
      case 'Quit':
        allDone();
        break;
    }
  });
}

function displayEmployees(sortBy) {
    let sql = `SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
    FROM employee 
    LEFT JOIN role ON employee.role_id = role.id 
    LEFT JOIN department ON role.department_id = department.id 
    LEFT JOIN employee manager ON manager.id = employee.manager_id`;
    if (sortBy) {
        sql += ` ORDER BY ${sortBy}`;
    }
    pool.query(sql, (err, data) => { // Changed connection.query to pool.query
        if (err) {
            console.error(err);
            return;
        }
        console.table(data.rows); // Use data.rows to display the result
        dispBy();
    });
} 
  
function dispBy() {
	inquire.prompt(viewByQ).then((answers) => {
	  switch (answers.viewBy) {
		case 'Department':
		  dispByDept();
		  break;
		case 'Manager':
		  dispByMgr();
		  break;
		case 'Want to do something else?':
		  whatToDo();
		  break;
	  }
	});
}

function dispByDept() {
  pool.query( // Changed connection.query to pool.query
    `SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee, role.title, department.dept_name, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.dept_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id ORDER BY department.dept_name`,
    (err,data) => { if (err){throw(err)}
      console.table(data.rows); // Use data.rows to display the result
      dispBy();
    })
}

function dispByMgr() {
  pool.query( // Changed connection.query to pool.query
  `SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee, role.title, department.dept_name, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.dept_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id ORDER BY manager`,
  (err,data) => { if (err){throw(err)}
    console.table(data.rows); // Use data.rows to display the result
    dispBy();
  })
}

function addEmployee() {
    pool.connect((err, client, done) => {
        if (err) {
            console.error('Error fetching client from pool', err);
            return;
        }
        inquire
            .prompt(empQs)
            .then((answers) => {
                console.log(answers);
                return pool.query(`SELECT id, title FROM role`);
            })
            .then((result) => {
                const roleChoices = result.rows.map(role => ({ name: role.title, value: role.id }));
                return inquire.prompt({
                    type: 'list',
                    name: 'roleId',
                    message: 'Choose a role:',
                    choices: roleChoices,
                }).then((answer) => {
                    console.log("Selected role ID:", answer.roleId);
                    // Insert the new employee into the database with the selected role ID
                    return pool.query(
                        `INSERT INTO employee (first_name, last_name, role_id) VALUES ($1, $2, $3)`,
                        [answers.fName, answers.lName, answer.roleId]
                    );
                });
            })
            .then(() => {
                console.log("Employee added successfully!");
                done();
                whatToDo();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
    });
}

// Function to remove an employee
async function removeEmployee() {
    try {
        const data = await pool.query(`SELECT id, CONCAT(first_name, ' ', last_name) AS employee FROM employee`); // Changed connection.query to pool.query
        if (data.rows.length === 0) {
            console.log("No employees found.");
            return;
        }
        const employeeChoices = data.rows.map(emp => ({ name: emp.employee, value: emp.id }));
        const answer = await inquire.prompt([{
            type: 'list',
            message: 'Choose employee to remove',
            name: 'employee',
            choices: employeeChoices
        }]);
        const deletedEmp = await pool.query(`DELETE FROM employee WHERE id = $1`, [answer.employee]); // Changed connection.query to pool.query
        console.log(`${deletedEmp.rowCount} employee deleted successfully.`);
        dispBy();
    } catch (err) {
        console.error("Error removing employee: ", err);
    }
}

function updateRole() {
    console.log('Update Employee\'s Role')
    whatToDo()
}

function updateMgr() {
    console.log('Update Employee\'s Manager')
    whatToDo()
}

function viewBudgetByDept() {
    console.log('View Total Utilized Budget By Department')
    whatToDo()
}

function allDone() {
    console.log('Quit')
    //process.exit
}

setEList();
setDList();
whatToDo();