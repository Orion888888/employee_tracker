const inquire = require('inquirer');
const { initQ, viewByQ, empQs, getR } = require('./helpers/questions'); // Import getR from questions module
const pool = require('./db/connections'); // Import the pool object

const setEList = () => {
    pool.query(
        `SELECT CONCAT(first_name, ' ', last_name) AS name FROM employee`,
        (err, data) => {
            if (err) throw err;
            eList = data.rows.map(row => row.name); // Use data.rows
            eList.push('None');
        }
    );
};

const setDList = () => {
    pool.query(
        `SELECT name FROM department`,
        (err, data) => {
            if (err) throw err;
            dList = data.rows.map(row => row.name);
        }
    );
};

function whatToDo() {
    inquire.prompt(initQ).then((answers) => {
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
    pool.query(sql, (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        console.table(data.rows);
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
    pool.query(
        `SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
         FROM employee 
         LEFT JOIN role ON employee.role_id = role.id 
         LEFT JOIN department ON role.department_id = department.id 
         LEFT JOIN employee manager ON manager.id = employee.manager_id 
         ORDER BY department.name`,
        (err, data) => {
            if (err) throw err;
            console.table(data.rows);
            dispBy();
        }
    );
}

function dispByMgr() {
    pool.query(
        `SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
         FROM employee 
         LEFT JOIN role ON employee.role_id = role.id 
         LEFT JOIN department ON role.department_id = department.id 
         LEFT JOIN employee manager ON manager.id = employee.manager_id 
         ORDER BY manager`,
        (err, data) => {
            if (err) throw err;
            console.table(data.rows);
            dispBy();
        }
    );
}

async function addEmployee() {
    try {
        const roles = await getR();
        const answers = await inquire.prompt([
            ...empQs,
            {
                type: 'list',
                name: 'roleId',
                message: 'Choose a role:',
                choices: roles
            }
        ]);
        await pool.query(
            `INSERT INTO employee (first_name, last_name, role_id) VALUES ($1, $2, $3)`,
            [answers.fName, answers.lName, answers.roleId]
        );
        console.log('Employee added successfully!');
        whatToDo();
    } catch (err) {
        console.error('Error adding employee:', err);
        whatToDo();
    }
}

async function removeEmployee() {
    try {
        const employees = await pool.query(`SELECT id, CONCAT(first_name, ' ', last_name) AS employee FROM employee`);
        if (employees.rows.length === 0) {
            console.log("No employees found.");
            return;
        }
        const employeeChoices = employees.rows.map(emp => ({ name: emp.employee, value: emp.id }));
        const answer = await inquire.prompt([{
            type: 'list',
            message: 'Choose employee to remove',
            name: 'employee',
            choices: employeeChoices
        }]);
        const deletedEmp = await pool.query(`DELETE FROM employee WHERE id = $1`, [answer.employee]);
        console.log(`${deletedEmp.rowCount} employee deleted successfully.`);
        dispBy();
    } catch (err) {
        console.error("Error removing employee: ", err);
    }
}

function updateRole() {
    console.log('Update Employee\'s Role');
    whatToDo();
}

function updateMgr() {
    console.log('Update Employee\'s Manager');
    whatToDo();
}

function viewBudgetByDept() {
    console.log('View Total Utilized Budget By Department');
    whatToDo();
}

function allDone() {
    console.log('Quit');
}

setEList();
setDList();
whatToDo();