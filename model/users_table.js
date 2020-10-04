const knex = require('./db_connection');

module.exports =  knex.schema.hasTable('users')
    .then(async exists=>{
    if (!exists){
        await knex.schema.createTable('users',(table)=>{
            table.increments('user_id').primary();
            table.string('eMail').notNull().unique();
            table.string('password');
            table.string('name').notNullable();
            table.integer('age').notNullable();
            table.integer('city_id').unsigned();

            table.foreign('city_id').references('city_id').inTable('city');

        },console.log('user table created with expected coulmns name'))
    }
}).catch(err=>{
    console.log(err)
})