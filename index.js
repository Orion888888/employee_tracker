const inquire = require('inquirer')
const mysql = require('mysql2/promise')
const {initQ,viewByQ, empQs} = require('./helpers/questions')
const connection = require('./db/connection')
let eList = []
let dList = []
let rList = []

connection.connect((err) =>{
    if (err) {throw(err)}
    setEList()
    setDList()
    //setRList()
    whatToDo()
})

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

