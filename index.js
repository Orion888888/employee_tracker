const inquire = require('inquirer')
const {initQ,viewByQ, empQs} = require('./helpers/questions')
const connection = require('./db/connections')
let eList = []
let dList = []
let rList = []

const setEList = () => {
  eList = []
  connection.query(
    `SELECT CONCAT(first_name, ' ', last_name) AS name FROM employee`,
    (err,data) => { if (err) { throw(err) }
    data.forEach(name =>{
      eList.push(`${name.name}`)
    })
    eList.push('None')
  })
}

const setDList = () => {
  connection.query(
    `SELECT dept_name FROM department`,
    (err,data) => { if (err) { throw(err) }
    data.forEach(dept =>{
      dList.push(`${dept.dept_name}`)
    })
    console.log(dList)
  })
}

const getR = () => {
  rList = []
  connection.query(
    `SELECT title FROM role`,
    (err,data) => { if (err) { throw(err) }
    data.forEach(role =>{
      rList.push(`${role.title}`)
    })
    inquire.prompt([{
      type: 'list',
      message: 'Choose Employee\s Role',
      name: 'role',
      choice: rList
    }]).then((answer) => {
      return answer.role
    })
  })
}
// TODO:console.log(appTitle())


function whatToDo() {
    inquire.prompt(initQ).then((answers) => {
      console.log(answers)

    })
}
  
function displayEmployees() {
    connection.query(
      `SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee, role.title, department.dept_name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.dept_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id`,
      (err,data) => { if (err) {console.log(err)}
        console.table(data)
        dispBy()
      }
    )
}

function dispBy() {
  inquire.prompt(viewByQ).then((answers) => {
    switch (answers.viewBy) {
      case 'Department': dispByDept();
      break;
      case 'Manager': dispByMgr();
      break;
      case 'Want to do something else?': whatToDo();
      break;
    }
  })
}

function dispByDept() {
  connection.query(
    `SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee, role.title, department.dept_name, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.dept_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id ORDER BY department.dept_name`,
    (err,data) => { if (err){throw(err)}
      console.table(data)
      dispBy()
    })
}

function dispByMgr() {
  connection.query(
  `SELECT employee.id, CONCAT(employee.first_name, ' ', employee.last_name) AS employee, role.title, department.dept_name, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.dept_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id ORDER BY manager`,
  (err,data) => { if (err){throw(err)}
    console.table(data)
    dispBy()
  })
}

function addEmployee() {
    let tRole = ''
    inquire.prompt(empQs)
    .then((answers) => {
      console.log(answers)
      console.log()
      let tRole = getR()
    })
    .then ((answers) => {
      console.log(answers)
      

      })
    
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
   
}

whatToDo()