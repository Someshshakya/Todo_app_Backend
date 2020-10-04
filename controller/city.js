const Knex = require("knex");

module.exports = (city,knex)=>{
    city.post('/city',async(req,res)=>{
        console.log(req.body)
        try{
            
            await knex('city') .insert({
                city_name : req.body.city_name
            })
            let data = await knex('city').select('*').where('city.city_name',req.body.city_name)
            if (data.length!==0){ 
                res.json(data[0])
            }else{
                res.send({Ops: "you did mistake"})
            }
            
        }catch (err){
            res.send(err)
        }
    })
}
// {
// 	"email":"anand@gmail.com",
// 	"password":"123asdf",
// 	"name":"Anand Patel"

// }