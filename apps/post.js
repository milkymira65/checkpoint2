import { Router } from "express"
import {pool} from "../utils/db.js"

const postRounter = Router();
 
postRounter.post("/", async (req, res) => {
    const newPost = {
        user_id: req.body.user_id,
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
        video: req.body.video,
        category_id: req.body.category_id,
        created_at: new Date(),
        updated_at: new Date()
    }

     let categoryId;
     const postCategoryId =[];

    // newPost.category_id = ["milk", "kan"]

    const allCategoryName = await pool.query(`select name from categorys`) // Category ทั้งหมด
    // อีกวิธีนึงในการทำให้มันเป็น Array
    // const categoryArray = allCategoryName.rows.reduce((preCategory, postCategory)=>{
    //     return [...preCategory, postCategory.name]
    // },[])

    let categoryArray = []
    for (let category of allCategoryName.rows) {
        categoryArray.push(category.name)
    }

    // categoryArray === [ 'dog', 'ant', 'pig', 'cat', 'bried' ]
    const createNewCategory = newPost.category_id.map((category) => { 
        if(!categoryArray.includes(category))
        { return category}
    })

    // createNewCategory === [ 'milk', 'kan' ]
    for (let category of createNewCategory){
        categoryId = await pool.query(`insert into categorys (name) values($1) returning category_id`, [category])
        postCategoryId.push(categoryId.rows[0].category_id)
    }

    //------- old way ----------------
    // newPost.category_id.map( async (item) => {
    //     categoryId = await pool.query(`select category_id from categorys where name=$1`,[item])

    //     if (categoryId.rows.length === 0) {
    //         categoryId = await pool.query(`insert into categorys (name) values($1) returning category_id`, [item])
    //         postCategoryId.push(categoryId.rows[0].category_id)
    //     }
    // })

    const postId = await pool.query(
        `insert into posts (user_id, title, content, image, video, category_id, created_at, updated_at )
        values($1, $2, $3, $4, $5, $6, $7, $8) returning post_id`,
        [
            newPost.user_id,
            newPost.title,
            newPost.content,
            newPost.image,
            newPost.video,
            newPost.category_id,
            newPost.created_at,
            newPost.updated_at
        ]
    )

    postCategoryId.map(async(item)=>{
        await pool.query(`insert into category_type (post_id, category_id) values($1, $2)`,
        [  
            postId.rows[0].post_id,
            item
        ]
        );
    });
    
   return res.status(200).json({ message: "New post successfully"});

})


postRounter.get("/",async (req,res)=>{ 
    const postData = await pool.query(`select * from posts`) 
    return res.status(200).json({data:postData.rows,message:"succsfully"})
})


postRounter.get("/:id",async (req,res)=>{
    const postId = req.params.id
    const postData =  await pool.query(`select * from posts where post_id=$1`,[postId]) 
    // console.log(req.query)ใช้เกี่ยวกับการค้นหา เช่น ไตเติล ที่ไม่สำคัญแล้วก็ที่ไม่ใช่เป็นความลับ(Credential)
    return res.status(200).json({data:postData.rows,message:"succsfully"})
 
})

postRounter.put("/:id",async(req,res)=>{
    const postId = req.params.id
    const newData = {
        user_id: req.body.user_id,
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
        video: req.body.video,
        category_id: req.body.category_id,
        updated_at: new Date()
    }

    await pool.query(`update posts set title=$1, content=$2, image=$3, video=$4, category_id=$5, updated_at=$6 where post_id=$7 `, 
    [
        
        newData.title,
        newData.content,
        newData.image, 
        newData.video,
        newData.category_id,
        newData.updated_at,
        postId
    ])

    return res.status(200).json({message:"Update successfully"})
    
})

postRounter.delete("/:id",async(req,res)=>{
    const postDelete = req.params.id
     await pool.query(`DELETE FROM posts WHERE post_id=$1`,[postDelete] )
    return res.status(200).json({message:" Delete succsfully"})
})




export default postRounter;