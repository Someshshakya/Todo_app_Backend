const bcrypt = require('bcrypt');
const Knex = require('../model/db_connection');

module.exports = async(req,res,next)=>{
    const email = req.cookies.user_id;
    // console.log(email)
    try{
        if (email!=undefined){
            const to_chekk = await Knex('users') .select('eMail').where('eMail',email);
            if (to_chekk.length!==0){
            // To verify the same users;
                if (email==to_chekk[0].eMail){
                    next();
                }else{
                    res.send('Login plz')
                }
            }else{
                res.send('you are not admin')
            }
        }else{
            res.send("Login plz ")
        }
        
    }catch (err){
        console.log(err)
    }
    

}