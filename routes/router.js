const express = require('express');
const auth = require('../auth/auth');
const router = express.Router();
const knex = require('../model/db_connection');
// auth middleware 
const auth_midddleware = require('../auth/auth')


// This will cotrol all  users (about login and sign_UP)
require('../controller/users')(router,knex,auth_midddleware);

// This will contain all the things about cities
require('../controller/city')(router,knex);

// This will controll all about todos
require('../controller/todos')(router,knex,auth_midddleware);

module.exports = router;