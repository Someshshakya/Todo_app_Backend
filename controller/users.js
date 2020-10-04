const router = require("../routes/router");
const bcrypt = require('bcrypt');
const chalk = require('chalk'); // By using this you can console your data in different colurs and fonts



module.exports = (router,knex,auth_midddleware)=>{
    router.post("/users",async(req,res)=>{
        const password = req.body.password;
        
        // This will Encrypt your password  (meaningless text)
        const hash = await bcrypt.hash(password,10);
        
        try {
            let body = req.body;

            const done = await knex('users') .insert({
                    name : body.name,
                    eMail : body.eMail,
                    password: hash,
                    age : body.age,
                    city_id : body.cityId
            })
            if (done){
                var data = await knex('users') .innerJoin('city','users.city_id','city.city_id')
                .select('users.user_id',
                        'users.name',
                        'users.eMail',
                        'users.age',
                        'users.city_id',
                        "city.city_name"
                        )
                .where('users.user_id',done)
                if (data.length!==0){
                    let city_id = data[0].city_id;
                    let city_name = data[0].city_name;
                    let city = {};
                    city["city"] = city_name;
                    city["id"] = city_id;
                    data[0]["city"] = city;
                    delete data[0].city_id;
                    delete data[0].city_name;
                    res.send(data[0])
    
                }else{
                    res.send("this id already exits")
                }
            }else{
                res.send(done)
            }
    
            
            
        }catch (err){
            res.send(err)
        }
    })

    // This will use to lgoin the user 
    router.post('/login',async(req,res)=>{
        const email = req.body.eMail;
        const password = req.body.password;
        try {
                  
            console.log(req.body);
            const user_data = await knex('users') .select('eMail','password').where('eMail',email)
            if (user_data.length!==0){
                const check = await bcrypt.compare(password,user_data[0].password);
                if (check){
                    res.cookie('user_id',user_data[0].eMail)
                    res.send("Logged in successfully")
                }else{
                    req.send("your password in correct")
                }
            }
            else{
                console.log(check)
                console.log('your password is incorrect!')
            }
        }catch (err) {
            res.send(err)
        }
 
    })

    // GEt all users  and individuals list  with auth
    router.get('/users',auth_midddleware,async(req,res,next)=>{
        try{
            const user_id = req.query.user_id;
            const ageMoreThan = req.query.ageMoreThan  || 0;
            const ageLessThan = req.query.ageLessThan || 999;
            const cityId = req.query.cityId;
        
 // to get users details by their's id
            if (user_id!=undefined){

                var result = await knex('users') .innerJoin('city','users.city_id','city.city_id')
                .select('users.user_id',
                        'users.name',
                        'users.eMail',
                        'users.age',
                        'users.city_id',
                      "city.city_name"
                        )
                .where('users.user_id',user_id)
                if (result.length!=0){
                    var Users_data = {}
                    var user_list = []
                    for (i in result){
                        let user = result[i]
                        let city = {};
                        city["city"] = user.city_name;
                        city["id"] = user.city_id;
                        user["city"] = city;
                        delete user.city_id;
                        delete user.city_name;

                        user_list.push(user);
                    }
                    Users_data["users"] = user_list;
                    res.send(Users_data)
                }else{
                    res.send("There is not data")
                }
// to filter the users by city id and agemoreThan and ageLessThan 
            }else if(cityId!=undefined){
                // console.log(cityId);
                var result = await knex('users') .innerJoin('city','users.city_id','city.city_id')
                .select('users.user_id',
                        'users.name',
                        'users.eMail',
                        'users.age',
                        'users.city_id',
                        "city.city_name"
                        )
                .where('users.city_id',cityId)
                .andWhere('users.age', '>=', ageMoreThan) // To filter the age of users ( default is 0)
                .andWhere('users.age', '<=', ageLessThan)// to filter the age with city id (default is 999)
                if (result.length!=0){
                   
                    var Users_data = {}
                    var user_list = []
                    for (i in result){
                        let user = result[i]
                        let city = {};
                        city["city"] = user.city_name;
                        city["id"] = user.city_id;
                        user["city"] = city;
                        delete user.city_id;
                        delete user.city_name;
                        user_list.push(user);
                        
                    }
                    Users_data["users"] = user_list;
                    // log(chalk.blue.bgRed.bold('Hello world!'));
                    console.log(chalk.blue.bold(user_list));
                    res.send(Users_data)
                }else{
                    res.send("There is not data")
                }
    

// To filter the age (ageMoreThan)
            }else if ((ageMoreThan!=undefined)||(ageLessThan!=undefined)) {
                var result = await knex('users') .innerJoin('city','users.city_id','city.city_id')
                .select('users.user_id',
                        'users.name',
                        'users.eMail',
                        'users.age',
                        'users.city_id',
                        "city.city_name"
                        )
                .where('users.age', '>=', ageMoreThan) // To filter the age of users ( default is 0)
    
                .andWhere('users.age', '<=', ageLessThan)// to filter the age of users (default is 999)
                if (result.length!=0){
                    var Users_data = {}
                    var user_list = []
                    for (i in result){
                        let user = result[i]
                        let city = {};
                        city["city"] = user.city_name;
                        city["id"] = user.city_id;
                        user["city"] = city;
                        delete user.city_id;
                        delete user.city_name;
                        let age = user.age;
                        user_list.push(user);
                    }
                    Users_data["users"] = user_list;
                    res.send(Users_data)
                }else{
                    res.send("There is not data")
                }      
            }

        }catch (err){
            res.send(err)
        }
            
    })



       
   //To Logout
   router.get('/logout', (req, res)=>{ 
    //it will clear the userData cookie 
    res.clearCookie('user_id'); 
    res.send('user logout successfully'); 
    }); 
}





// {
// 	"name": "Deepak",
// 	"eMail": "deepakk@gmail.com",
// 	"password": "deepak@123",
// 	"age": 18,
// 	"city_id": 1
// }

