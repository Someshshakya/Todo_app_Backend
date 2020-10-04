const { table } = require('./db_connection')
const knex = require('./db_connection')

module.exports = knex.schema.hasTable('city')
    .then(exists=>{
        if (!exists){
            knex.schema.createTable("city",(table)=>{
                table.increments('city_id').primary();;
                table.string('city_name').notNullable()
            })
            .then(done=>{
                console.log("city table created")
            })
            .catch(err=>{
                console.log('check your schema')
            })
        }
    })
    .catch(err=>{
        console.log("There is some error while creating table")
    })