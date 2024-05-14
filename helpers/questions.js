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

module.exports = {initQ,viewByQ,empQs,uRoleQs}