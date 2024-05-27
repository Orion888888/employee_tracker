const inquirer = require('inquirer');
const { initQ, viewByQ, empQs, getR } = require('./helpers/questions');
const pool = require('./db/connection');

let eList = [];
let dList = [];

const setEList = async () => {
    try {
        const { rows } = await pool.query('SELECT CONCAT(first_name, \' \', last_name) AS name FROM employee');
        eList = rows.map(row => row.name);
        eList.push('None');
    } catch (err) {
        console.error('Error fetching employee list:', err);
    }
};

const setDList = async () => {
    try {
        const { rows } = await pool.query('SELECT name FROM department');
        dList = rows.map(row => row.name);
    } catch (err) {
        console.error('Error fetching department list:', err);
    }
};

const whatToDo = async () => {
    const answers = await inquirer.prompt(initQ);
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
};

const displayEmployees = async (sortBy) => {
    let sql = `SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
               FROM employee 
               LEFT JOIN role ON employee.role_id = role.id 
               LEFT JOIN department ON role.department_id = department.id 
               LEFT JOIN employee manager ON manager.id = employee.manager_id`;
    if (sortBy) {
        sql += ` ORDER BY ${sortBy}`;
    }
    try {
        const { rows } = await pool.query(sql);
        console.table(rows);
        dispBy();
    } catch (err) {
        console.error('Error displaying employees:', err);
    }
};

const dispBy = async () => {
    const answers = await inquirer.prompt(viewByQ);
    displayEmployees(answers.sortBy);
};

const addEmployee = async () => {
    try {
        const roles = await getR(pool);
        if (roles.length === 0) {
            console.error('No roles found in the database.');
            return whatToDo();
        }
        const answers = await inquirer.prompt([
            ...empQs,
            {
                type: 'list',
                name: 'roleId',
                message: 'Choose a role:',
                choices: roles,
            },
        ]);
        await pool.query(
            'INSERT INTO employee (first_name, last_name, role_id) VALUES ($1, $2, $3)',
            [answers.fName, answers.lName, answers.roleId]
        );
        console.log('Employee added successfully!');
        whatToDo();
    } catch (err) {
        console.error('Error adding employee:', err);
        whatToDo();
    }
};

const removeEmployee = async () => {
    try {
        const { rows } = await pool.query('SELECT id, CONCAT(first_name, \' \', last_name) AS name FROM employee');
        const employeeChoices = rows.map(row => ({ name: row.name, value: row.id }));
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: 'Choose an employee to remove:',
                choices: employeeChoices,
            },
        ]);
        await pool.query('DELETE FROM employee WHERE id = $1', [answers.employeeId]);
        console.log('Employee removed successfully!');
        whatToDo();
    } catch (err) {
        console.error('Error removing employee:', err);
        whatToDo();
    }
};

const updateRole = async () => {
    try {
        const { rows: employees } = await pool.query('SELECT id, CONCAT(first_name, \' \', last_name) AS name FROM employee');
        const employeeChoices = employees.map(row => ({ name: row.name, value: row.id }));
        const roles = await getR(pool);
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: 'Choose an employee to update their role:',
                choices: employeeChoices,
            },
            {
                type: 'list',
                name: 'roleId',
                message: 'Choose a new role:',
                choices: roles,
            },
        ]);
        await pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [answers.roleId, answers.employeeId]);
        console.log('Employee role updated successfully!');
        whatToDo();
    } catch (err) {
        console.error('Error updating employee role:', err);
        whatToDo();
    }
};

const updateMgr = async () => {
    try {
        const { rows: employees } = await pool.query('SELECT id, CONCAT(first_name, \' \', last_name) AS name FROM employee');
        const employeeChoices = employees.map(row => ({ name: row.name, value: row.id }));
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'employeeId',
                message: 'Choose an employee to update their manager:',
                choices: employeeChoices,
            },
            {
                type: 'list',
                name: 'managerId',
                message: 'Choose a new manager:',
                choices: employeeChoices,
            },
        ]);
        await pool.query('UPDATE employee SET manager_id = $1 WHERE id = $2', [answers.managerId, answers.employeeId]);
        console.log('Employee manager updated successfully!');
        whatToDo();
    } catch (err) {
        console.error('Error updating employee manager:', err);
        whatToDo();
    }
};

const viewBudgetByDept = async () => {
    try {
        const { rows } = await pool.query(`
            SELECT department.name AS department, SUM(role.salary) AS utilized_budget
            FROM employee
            LEFT JOIN role ON employee.role_id = role.id
            LEFT JOIN department ON role.department_id = department.id
            GROUP BY department.name
        `);
        console.table(rows);
        whatToDo();
    } catch (err) {
        console.error('Error viewing budget by department:', err);
        whatToDo();
    }
};

const allDone = async () => {
    console.log('Quit');
    try {
        await pool.end();
        console.log('Pool closed');
    } catch (err) {
        console.error('Error closing the pool:', err);
    }
};

setEList();
setDList();
whatToDo();