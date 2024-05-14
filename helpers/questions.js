const inquire = require('inquirer');
const connection = require('../db/connections');

const initQ = [ //asks user What do you want to do?
    {
    type: 'list',
    message: 'What do you want to do?',
    name: 'wdywtd',
    choices: [
        'View All Employees (sort by)',
        'Add Employee',
        'Remove Employee',
        'Update Employee Role',
        'Update Employee Manager',
        'View Total Utilized Budget By Department',
        'Quit'
    ]
    },
]

const viewByQ = [
    {
    type: 'list',
    message: 'Sort employees by...',
    name: 'viewBy',
    choices: [
        'Department',
        'Manager',
        'Want to do something else?'
    ]
    },
]

const empQs = [
    {
        type: 'input',
        message: 'Enter New Employee\'s First Name',
        name: 'fName',
    },{
        type: 'input',
        message: 'Enter New Employee\'s Last Name',
        name: 'lName',
    }
]

const uRoleQs = [
    {
        type: 'input',
        message: 'Which Employee(by ID)?',
        name: 'id',
    }
]

const getR = async () => {
    try {
        const data = await connection.query(`SELECT id, title FROM role`);
        if (data.rows.length === 0) {
            console.log("No roles found. Please add roles before proceeding.");
            return null;
        }
        const roleChoices = data.rows.map(role => ({ name: role.title, value: role.id }));
        const answer = await inquire.prompt([{
            type: 'list',
            message: 'Choose Employee\'s Role',
            name: 'role',
            choices: roleChoices
        }]);
        return answer.role;
    } catch (err) {
        console.error("Error fetching roles: ", err);
        return null;
    }
};

module.exports = { initQ, viewByQ, empQs, getR };