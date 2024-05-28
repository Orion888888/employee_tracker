const inquire = require('inquirer');
const { initQ, viewByQ, empQs } = require('./helpers/questions');
const pool = require('./db/connection');
pool.connect();

function whatToDo() {
    inquire.prompt(initQ).then((answers) => {
        console.log(answers);
        switch (answers.wdywtd) {
            case `View All Employees (sort by)`: displayEmployees();
                break;
            case 'Add Employee': addEmployee();
                break;
            case 'Remove Employee': removeEmployee();
                break;
            case 'Update Employee Role': updateRole();
                break;
            case 'Update Employee Manager': updateMgr();
                break;
            case 'View Total Utilized Budget By Department': viewBudgetByDept();
                break;
            case 'Quit': allDone();
                break;
        }
    });
}

function addEmployee() {
    inquire.prompt(empQs)
        .then((answers) => {
            console.log(answers);
            return getR();
        })
        .then((tRole) => {
            console.log("****", tRole);
            pool.query("INSERT INTO employee (first_name, last_name, role_id,  manager_id) VALUES($4)");
        })
        .catch((err) => {
            console.error(err);
        });
}

const getR = () => {
    return new Promise((resolve, reject) => {
        let rList = [];
        pool.query(
            `SELECT * FROM role`,
            (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    const { rows } = data;
                    rows.forEach(role => {
                        rList.push({ name: role.title, value: role.id });
                    });
                    inquire.prompt([{
                        type: 'list',
                        message: 'Choose Employee\'s Role',
                        name: 'role_id',
                        choices: rList
                    }]).then((answer) => {
                        console.log(answer);
                        resolve(answer.role_id);
                    }).catch((err) => {
                        reject(err);
                    });
                }
            }
        );
    });
}

whatToDo();