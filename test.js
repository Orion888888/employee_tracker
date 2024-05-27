const inquire = require('inquirer')
const {initQ,viewByQ, empQs} = require('./helpers/questions')
const pool = require('./db/connection')
pool.connect()
function whatToDo() {
    inquire.prompt(initQ).then((answers) => {
      console.log(answers)
        switch (answers.wdywtd) { 
          case `View All Employees (sort by)`: displayEmployees();
          break;
          case 'Add Employee': addEmployee();
          break;
          case 'Remove Employee': removeEmployee();
          break;
          case 'Update Employee Role': updateRole();
          break;
          // case for updating salary: updateSal();
          case 'Update Employee Manager': updateMgr();
          break;
          case 'View Total Utilized Budget By Department': viewBudgetByDept();
          break;
          case 'Quit': allDone();
          break;
        }  
    })
}
function addEmployee() {
    let tRole = ''
    inquire.prompt(empQs)
    .then((answers) => {
      console.log(answers)
    
      let tRole = getR()
      console.log("****", tRole)
    })
    .then ((answers) => {
      console.log(answers,tRole)
      pool.query("INSERT INTO employee (first_name, last_name, role_id,  manager_id) VALUES($4)")
      
    //connection.query(
      // `INSERT INTO employee (first_name, last_name, role_id, manager_id)
      // VALUES ${answers.fName.toLowerCase()},${answers.lName.toLowerCase()}, ${tRole}, ${answers.manager}`,
      // (err,data) => { if (err){ console.log(err)}
      // console.table(data)
      // dispBy()
      })
    
  }
  const getR = () => {
    rList = []
   pool.query(
      `SELECT * FROM role`,
      (err,data) => { if (err) { throw(err) }
      const{
        rows
      } = data
      rows.forEach(role =>{
        rList.push({name: role.title, value: role.id})
      })
      inquire.prompt([{
        type: 'list',
        message: 'Choose Employee\s Role',
        name: 'role_id',
        choices: rList
      }]).then((answer) => {
       // return answer.role
       console.log(answer)
       return answer.role_id
      })
    })
  }
whatToDo()