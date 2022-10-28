import { Router } from "express";
import { pool } from "../utils/db.js";

const usersRounter = Router();
usersRounter.post("/", async (req, res) => {

      const newUser ={username:req.body.username,
                      password : req.body.password,
                    position:req.body.position,
                firstname:req.body.firstname,
            lastname:req.body.lastname,
        created_at:new Date(),
    updated_at:new Date(),
last_logged_in: new Date()  }

await pool.query(
    `insert into users (username,password,position,firstname,lastname,created_at,updated_at,last_logged_in) 
    values($1,$2,$3,$4,$5,$6,$7,$8) `,
    [
        newUser.username,
       newUser.password, 
       newUser.position, 
       newUser.firstname,
       newUser.lastname,
       newUser.created_at,
       newUser.updated_at, 
       newUser.last_logged_in
     ] 
)

return res.status(201).json({ message: "New user has been created successfully", 
});


} );

usersRounter.get("/",async (req,res)=>{
    const userData =  await pool.query(`select * from users`) 
    
    return res.status(200).json({data:userData.rows,message:"succsfully"})

})

usersRounter.get("/:id",async (req,res)=>{
    const userId = req.params.id
    const userData =  await pool.query(`select * from users where user_id=$1`,[userId]) 
    
    return res.status(200).json({data:userData.rows,message:"succsfully"})

})






export default usersRounter;


//     const newUser = { username: req.body.username,
//          password: req.body.password,
//           position: req.body.position,
//            firstname: req.body.firstname,
//             lastname: req.body.lastname, 
//             created_at: new Date()
//             , updated_at: new Date(),
//              last_logged_in: new Date(), };
    
// await pool.query(
//      `insert into users (username, password, position, firstname, lastname, created_at, updated_at, last_logged_in) 
//      values($1,$2,$3,$4,$5,$6,$7,$8)`, 
// [ newUser.username,
//      newUser.password, 
//      newUser.position, 
//      newUser.firstname,
//       newUser.lastname,
//        newUser.created_at,
//         newUser.updated_at, 
//         newUser.last_logged_in, ] );

// })
