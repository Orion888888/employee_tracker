const initQ = [
  {
      type: 'list',
      name: 'wdywtd',
      message: 'What do you want to do?',
      choices: [
          'View All Employees (sort by)',
          'Add Employee',
          'Remove Employee',
          'Update Employee Role',
          'Update Employee Manager',
          'View Total Utilized Budget By Department',
          'Quit',
      ],
  },
];

const viewByQ = [
  {
      type: 'list',
      name: 'sortBy',
      message: 'Sort employees by:',
      choices: ['id', 'employee', 'title', 'department', 'salary', 'manager'],
  },
];

const empQs = [
  {
      type: 'input',
      name: 'fName',
      message: 'Enter employee\'s first name:',
  },
  {
      type: 'input',
      name: 'lName',
      message: 'Enter employee\'s last name:',
  },
];

const getR = async (pool) => {
  const { rows } = await pool.query('SELECT * FROM role');
  return rows.map(role => ({ name: role.title, value: role.id }));
};

module.exports = { initQ, viewByQ, empQs, getR };