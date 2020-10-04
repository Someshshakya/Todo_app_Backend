const knex = require('./db_connection')

module.exports = knex.schema.hasTable('todo')
    .then(exists=>{
        if (!exists){
            knex.schema.createTable("todo",(table)=>{
                table.increments('todo_id').primary();
                table.string('text').notNullable();
                table.integer('assignedTo').notNullable();
                table.string('dueDate').notNullable();
            })
            .then(done=>{
                console.log("todo table has created")
            })
            .catch(err=>{
                console.log('check your schema')
            })
        }
    })
    .catch(err=>{
        console.log("There is some error while creating table")
    })