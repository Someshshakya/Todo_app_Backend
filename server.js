const express = require('express')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
app.use(express.json())
app.use(cookieParser());
//to connect .env file 
require('dotenv').config();
const  PORT = process.env.PORT || 8080

const router = require('./routes/router');
app.use(router)
// // acceccess all routes
// require('./model/db_connection');
// // to create city table
// require('./model/city_table');

// // to create users tables
// require('./model/users_table');

// to create todo table
// require('./model/todo_table');

app.listen(PORT,()=>{
    console.log(`Sever is running at  ${PORT}`)
})
