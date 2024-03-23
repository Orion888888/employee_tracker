const inquire = require('inquirer')
const mysql = require('mysql2/promise')
const {initQ,viewByQ, empQs} = require('./helpers/questions')
const connection = require('./db/connection')
let eList = []
let dList = []
let rList = []

