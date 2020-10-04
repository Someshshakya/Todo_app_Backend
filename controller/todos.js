const { Seeder } = require('knex');
const moment = require('moment');
const { as } = require('../model/db_connection');


module.exports = (todos,knex,auth_midddleware)=>{

    todos.post("/todos",auth_midddleware,async(req,res,next)=>{
        try{
            var date_now = moment().format("YYYY MM DD")
            var text = req.body.text;
            var assignedTo = req.body.assignedTo;
            console.log(assignedTo);
            const data_inset = await knex('todo') .insert({
                text : text,
                assignedTo : assignedTo,
                dueDate : date_now
            })
            .catch(err=>{
                res.send(err)
            })
            if (data_inset){
                var todo = await knex('users') 
                .innerJoin('city','users.city_id','city.city_id')
                .innerJoin('todo','users.user_id','todo.assignedTo')
                .select(
                        'users.name',
                        'users.eMail',
                        'users.city_id',
                        "city.city_name",
                        'todo.assignedTo',
                        'todo.text',
                        'todo.dueDate'
                        )
                .where('users.user_id',assignedTo)
                if (todo.length!=0){
                    let i  = todo[todo.length-1]
                    var my_data = {};
                    my_data['todo'] = {};
                    my_data["todo"]["text"] = i.text;
                    my_data['todo']['dueDate'] = i.dueDate;
                    my_data["todo"]["assignedTo"]= {}
                    my_data["todo"]["assignedTo"]["id"] = i.assignedTo;
                    my_data["todo"]["assignedTo"]["name"] = i.name;
                    my_data["todo"]["assignedTo"]["eMail"] = i.eMail;
                    my_data["todo"]["assignedTo"]["city"] = {}
                    my_data["todo"]["assignedTo"]["city"]["name"] = i.city_name;
                    my_data["todo"]["assignedTo"]["city"]["id"] = i.city_id;
                    console.log(my_data);
                    res.send(my_data)
                }else{
                    res.send({Sorry : "no data found "})
                }
                
            }
        }catch (err){
            res.send(err)
        }
    })

    // To get my todos (with auth)
    todos.get('/mytodos',auth_midddleware,async(req,res,next)=>{
        let email = req.cookies.user_id;
        console.log(email);
        var result = await knex('users') 
        .innerJoin('todo','users.user_id','todo.assignedTo')
        .select('todo.text')
        .where('users.eMail',email);
        if (result.length1!==0){
        
            let my_todos = {}
            my_todos["todos"] = result
            res.send(my_todos)
        }else{
            res.send({Sorry : "there are no todos"})
        }
    })

    // To get all the todos (with auth)
    todos.get('/todos',auth_midddleware,async(req,res,next)=>{
        var list_id = req.query.assignedTo;
        var fromDueDate = req.query.fromDueDate;
        var toDueDate = req.query.toDueDate  || moment().format("YYYY MM DD");
        var cityID = req.query.cityID;
        if (list_id!=undefined){
            my_list = list_id.slice(1,list_id.length-1).split(",")
            var all_user = {}
            all_user["users"] = []
            for (i in my_list){
                var user_id = parseInt(my_list[i])
                const each_user_data =  await knex('users') 
                .innerJoin('city','users.city_id','city.city_id')
                .innerJoin('todo','users.user_id','todo.assignedTo')
                .select(
                        'users.name',
                        'users.eMail',
                        'users.city_id',
                        "city.city_name",
                        'todo.assignedTo',
                        'todo.text',
                        'todo.dueDate'
                        )
                .where('users.user_id',user_id)
                if (each_user_data.length!=0){
                    for (l in each_user_data){
                        let i  =  each_user_data[l]
                        var my_data = {};
                        my_data['todo'] = {};
                        my_data["todo"]["text"] = i.text;
                        my_data['todo']['dueDate'] = i.dueDate;
                        my_data["todo"]["assignedTo"]= {}
                        my_data["todo"]["assignedTo"]["id"] = i.assignedTo;
                        my_data["todo"]["assignedTo"]["name"] = i.name;
                        my_data["todo"]["assignedTo"]["eMail"] = i.eMail;
                        my_data["todo"]["assignedTo"]["city"] = {}
                        my_data["todo"]["assignedTo"]["city"]["name"] = i.city_name;
                        my_data["todo"]["assignedTo"]["city"]["id"] = i.city_id;
                        console.log(my_data);
                        all_user["users"].push(my_data)
                    }
                }else{
                    all_user["users"].push({})
                }
            }  res.send(all_user)

        }else if ((fromDueDate!=undefined) && (toDueDate!=undefined)){
            const each_user_data =  await knex('users') 
            .innerJoin('city','users.city_id','city.city_id')
            .innerJoin('todo','users.user_id','todo.assignedTo')
            .select(
                    'users.name',
                    'users.eMail',
                    'users.city_id',
                    "city.city_name",
                    'todo.assignedTo',
                    'todo.text',
                    'todo.dueDate'
                    )
            if (each_user_data.length!=0){
                var all_user = {}
                all_user["users"] = []
                for (l in each_user_data){
                    let i  =  each_user_data[l]
                    var my_data = {};
                    my_data['todo'] = {};
                    my_data["todo"]["text"] = i.text;
                    my_data['todo']['dueDate'] = i.dueDate;
                    my_data["todo"]["assignedTo"]= {}
                    my_data["todo"]["assignedTo"]["id"] = i.assignedTo;
                    my_data["todo"]["assignedTo"]["name"] = i.name;
                    my_data["todo"]["assignedTo"]["eMail"] = i.eMail;
                    my_data["todo"]["assignedTo"]["city"] = {}
                    my_data["todo"]["assignedTo"]["city"]["name"] = i.city_name;
                    my_data["todo"]["assignedTo"]["city"]["id"] = i.city_id;
    
    
                    // This only works when it is in the converted into moment
                    const fromm = moment(fromDueDate, "YYYY MM DD");
                    const date2 = moment(i.dueDate, "YYYY MM DD");

                    const too = moment(toDueDate, "YYYY MM DD");
                    if (date2.isAfter(fromm)&&(date2.isBefore(too))){
                        
                        all_user["users"].push(my_data);
                    }
 
                } res.send(all_user)
            }else{
                res.send({Ops: 'there is no data'})
            }
        }else if(cityID!=undefined){
            const each_user_data =  await knex('users') 
                .innerJoin('city','users.city_id','city.city_id')
                .innerJoin('todo','users.user_id','todo.assignedTo')
                .select(
                        'users.name',
                        'users.eMail',
                        'users.city_id',
                        "city.city_name",
                        'todo.assignedTo',
                        'todo.text',
                        'todo.dueDate'
                        )
                .where('users.city_id',cityID)
                if (each_user_data.length!=0){
                    var all_user = {}
                    all_user["users"] = []
                    for (l in each_user_data){
                        let i  =  each_user_data[l]
                        var my_data = {};
                        my_data['todo'] = {};
                        my_data["todo"]["text"] = i.text;
                        my_data['todo']['dueDate'] = i.dueDate;
                        my_data["todo"]["assignedTo"]= {}
                        my_data["todo"]["assignedTo"]["id"] = i.assignedTo;
                        my_data["todo"]["assignedTo"]["name"] = i.name;
                        my_data["todo"]["assignedTo"]["eMail"] = i.eMail;
                        my_data["todo"]["assignedTo"]["city"] = {}
                        my_data["todo"]["assignedTo"]["city"]["name"] = i.city_name;
                        my_data["todo"]["assignedTo"]["city"]["id"] = i.city_id;
                        // console.log(my_data);
                        all_user["users"].push(my_data)
                    }res.send(all_user)
                }else{
                    res.send({Ops:"There is no data found with this city id"})
                }
        }else{
            const result =  await knex('users') 
                .innerJoin('city','users.city_id','city.city_id')
                .innerJoin('todo','users.user_id','todo.assignedTo')
                .select(
                        'users.name',
                        'users.eMail',
                        'users.city_id',
                        "city.city_name",
                        'todo.assignedTo',
                        'todo.text',
                        'todo.dueDate'
                        )
            if (result.length1!==0){
                var all_user_todo = {}
               all_user_todo["users"] = []

                for (d in result){
                    let i  =  result[d]
                    var my_data = {};
                    my_data['todo'] = {};
                    my_data["todo"]["text"] = i.text;
                    my_data['todo']['dueDate'] = i.dueDate;
                    my_data["todo"]["assignedTo"]= {}
                    my_data["todo"]["assignedTo"]["id"] = i.assignedTo;
                    my_data["todo"]["assignedTo"]["name"] = i.name;
                    my_data["todo"]["assignedTo"]["eMail"] = i.eMail;
                    my_data["todo"]["assignedTo"]["city"] = {}
                    my_data["todo"]["assignedTo"]["city"]["name"] = i.city_name;
                    my_data["todo"]["assignedTo"]["city"]["id"] = i.city_id;
                    // console.log(my_data);
                    all_user_todo["users"].push(my_data)
                }
                res.send(all_user_todo)
            }else{
                res.send({Sorry : "there are no todos"})
            }
        }
  
        
    })

}