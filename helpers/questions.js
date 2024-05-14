const inquire = require('inquirer');

const initQ = [
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

const pool = require('../db/connections');

const getR = () => {
  return new Promise((resolve, reject) => {
    pool.query(
      `SELECT id, title FROM role`,
      (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        if (data.rows.length === 0) {
          reject(new Error('No roles found.'));
          return;
        }
        const roleChoices = data.rows.map(role => ({ name: role.title, value: role.id }));
        resolve(roleChoices);
      }
    );
  });
};

module.exports = { getR };


module.exports = { initQ, viewByQ, empQs, getR };